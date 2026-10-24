const sessionService = require('../services/sessionService');

const bookSession = async (req, res, next) => {
  try {
    const learnerId = req.user._id;
    const session = await sessionService.createSession(learnerId, req.body);
    res.status(201).json({
      message: 'Session booked successfully!',
      session,
    });
  } catch (error) {
    next(error);
  }
};

const getLearnerSessions = async (req, res, next) => {
  try {
    const learnerId = req.user._id;
    const sessions = await sessionService.getLearnerSessions(learnerId);
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

const getMentorSessions = async (req, res, next) => {
  try {
    const mentorId = req.user._id;
    const sessions = await sessionService.getMentorSessions(mentorId);
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

const updateSessionStatus = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;
    const { status, cancellationReason } = req.body;

    const updatedSession = await sessionService.updateSessionStatus(
      sessionId,
      userId,
      status,
      cancellationReason
    );

    res.status(200).json({
      message: `Session status updated to ${status}`,
      session: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

const getMentorAvailability = async (req, res, next) => {
  try {
    const mentorId = req.params.mentorId;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const availability = await sessionService.getMentorAvailability(mentorId, date);
    res.status(200).json(availability);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookSession,
  getLearnerSessions,
  getMentorSessions,
  updateSessionStatus,
  getMentorAvailability,
};
