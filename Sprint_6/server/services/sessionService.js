const Session = require('../models/Session');
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const LearnerProfile = require('../models/LearnerProfile');
const notificationService = require('./notificationService');

// Default daily standard time slots for booking
const STANDARD_SLOTS = [
  { startTime: '09:00 AM', endTime: '10:00 AM' },
  { startTime: '10:00 AM', endTime: '11:00 AM' },
  { startTime: '11:00 AM', endTime: '12:00 PM' },
  { startTime: '02:00 PM', endTime: '03:00 PM' },
  { startTime: '03:00 PM', endTime: '04:00 PM' },
  { startTime: '04:00 PM', endTime: '05:00 PM' },
  { startTime: '05:00 PM', endTime: '06:00 PM' },
];

const createSession = async (learnerId, { mentorId, date, startTime, endTime, topic, description }) => {
  // 1. Validation: Required fields
  if (!mentorId || !date || !startTime || !topic) {
    throw new Error('Mentor, date, start time, and topic are required.');
  }

  // 2. Validation: Past Date check
  const bookingDate = new Date(`${date}T23:59:59`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (bookingDate < today) {
    throw new Error('Booking date cannot be in the past.');
  }

  // 3. Validation: Verify Mentor User
  const mentorUser = await User.findById(mentorId);
  if (!mentorUser || mentorUser.role !== 'mentor') {
    throw new Error('Selected mentor does not exist or is invalid.');
  }

  const learnerUser = await User.findById(learnerId);
  if (!learnerUser) {
    throw new Error('Learner user not found.');
  }

  // 4. Validation: Slot collision check
  const existingSession = await Session.findOne({
    mentorId,
    date,
    startTime,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (existingSession) {
    throw new Error('The selected time slot is already booked for this mentor. Please select another slot.');
  }

  // 5. Validation: Learner double booking check
  const learnerConflict = await Session.findOne({
    learnerId,
    date,
    startTime,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (learnerConflict) {
    throw new Error('You already have a pending or confirmed session at this time.');
  }

  // Calculate default endTime if not provided
  const resolvedEndTime = endTime || calculateEndTime(startTime);

  // 6. Create Session Document
  const session = await Session.create({
    learnerId,
    mentorId,
    date,
    startTime,
    endTime: resolvedEndTime,
    topic: topic.trim(),
    description: (description || '').trim(),
    status: 'pending',
    meetingLink: `https://meet.jit.si/MentorConnect-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  });

  // 7. Generate Notifications
  await notificationService.createNotification({
    recipientId: mentorId,
    type: 'booking_request',
    title: 'New Mentoring Session Request',
    message: `${learnerUser.name} requested a mentoring session on ${date} at ${startTime} on topic: "${topic}".`,
    relatedSessionId: session._id,
  });

  await notificationService.createNotification({
    recipientId: learnerId,
    type: 'booking_request',
    title: 'Booking Request Submitted',
    message: `Your session request with ${mentorUser.name} for ${date} at ${startTime} has been sent successfully.`,
    relatedSessionId: session._id,
  });

  return await populateSessionDetails(session._id);
};

const getLearnerSessions = async (learnerId) => {
  const sessions = await Session.find({ learnerId })
    .populate('mentorId', 'name email role')
    .sort({ date: 1, startTime: 1 });

  // Attach MentorProfile details
  const enrichedSessions = await Promise.all(
    sessions.map(async (sess) => {
      const sessObj = sess.toObject();
      if (sess.mentorId) {
        const mentorProf = await MentorProfile.findOne({ userId: sess.mentorId._id });
        sessObj.mentorProfile = mentorProf;
      }
      return sessObj;
    })
  );

  return enrichedSessions;
};

const getMentorSessions = async (mentorId) => {
  const sessions = await Session.find({ mentorId })
    .populate('learnerId', 'name email role')
    .sort({ date: 1, startTime: 1 });

  // Attach LearnerProfile details
  const enrichedSessions = await Promise.all(
    sessions.map(async (sess) => {
      const sessObj = sess.toObject();
      if (sess.learnerId) {
        const learnerProf = await LearnerProfile.findOne({ userId: sess.learnerId._id });
        sessObj.learnerProfile = learnerProf;
      }
      return sessObj;
    })
  );

  return enrichedSessions;
};

const updateSessionStatus = async (sessionId, userId, newStatus, reason = '') => {
  const session = await Session.findById(sessionId)
    .populate('learnerId', 'name email')
    .populate('mentorId', 'name email');

  if (!session) {
    throw new Error('Session not found.');
  }

  // Role Ownership Validation
  const isLearner = session.learnerId._id.toString() === userId.toString();
  const isMentor = session.mentorId._id.toString() === userId.toString();

  if (!isLearner && !isMentor) {
    throw new Error('You are not authorized to update this session.');
  }

  if (['confirmed', 'rejected'].includes(newStatus) && !isMentor) {
    throw new Error('Only the mentor can confirm or reject a session request.');
  }

  session.status = newStatus;
  if (reason) {
    session.cancellationReason = reason;
  }

  await session.save();

  // Send Notifications based on status change
  if (newStatus === 'confirmed') {
    await notificationService.createNotification({
      recipientId: session.learnerId._id,
      type: 'booking_confirmed',
      title: 'Session Confirmed!',
      message: `${session.mentorId.name} has confirmed your mentoring session on ${session.date} at ${session.startTime}.`,
      relatedSessionId: session._id,
    });
  } else if (newStatus === 'rejected') {
    await notificationService.createNotification({
      recipientId: session.learnerId._id,
      type: 'booking_rejected',
      title: 'Session Request Declined',
      message: `${session.mentorId.name} declined your session request. ${reason ? `Reason: ${reason}` : ''}`,
      relatedSessionId: session._id,
    });
  } else if (newStatus === 'cancelled') {
    const notifyUser = isLearner ? session.mentorId._id : session.learnerId._id;
    const cancellerName = isLearner ? session.learnerId.name : session.mentorId.name;

    await notificationService.createNotification({
      recipientId: notifyUser,
      type: 'booking_cancelled',
      title: 'Session Cancelled',
      message: `The session on ${session.date} at ${session.startTime} was cancelled by ${cancellerName}.`,
      relatedSessionId: session._id,
    });
  } else if (newStatus === 'completed') {
    await notificationService.createNotification({
      recipientId: session.learnerId._id,
      type: 'system',
      title: 'Session Completed',
      message: `Your mentoring session on "${session.topic}" with ${session.mentorId.name} has been marked completed.`,
      relatedSessionId: session._id,
    });
  }

  return await populateSessionDetails(session._id);
};

const getMentorAvailability = async (mentorId, date) => {
  const mentor = await User.findById(mentorId);
  if (!mentor || mentor.role !== 'mentor') {
    throw new Error('Mentor not found.');
  }

  // Find booked slots for date
  const bookedSessions = await Session.find({
    mentorId,
    date,
    status: { $in: ['pending', 'confirmed'] },
  });

  const bookedTimes = new Set(bookedSessions.map((s) => s.startTime));

  const availableSlots = STANDARD_SLOTS.map((slot) => ({
    ...slot,
    isAvailable: !bookedTimes.has(slot.startTime),
  }));

  return {
    mentorId,
    date,
    slots: availableSlots,
  };
};

// Internal Helper Functions
const populateSessionDetails = async (sessionId) => {
  const session = await Session.findById(sessionId)
    .populate('learnerId', 'name email role')
    .populate('mentorId', 'name email role');

  const sessObj = session.toObject();
  sessObj.mentorProfile = await MentorProfile.findOne({ userId: session.mentorId._id });
  sessObj.learnerProfile = await LearnerProfile.findOne({ userId: session.learnerId._id });
  return sessObj;
};

const calculateEndTime = (startTime) => {
  const index = STANDARD_SLOTS.findIndex((s) => s.startTime === startTime);
  if (index !== -1) {
    return STANDARD_SLOTS[index].endTime;
  }
  return '1 Hour Session';
};

module.exports = {
  createSession,
  getLearnerSessions,
  getMentorSessions,
  updateSessionStatus,
  getMentorAvailability,
};
