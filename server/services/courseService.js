const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const PaymentOrder = require('../models/PaymentOrder');
const emailService = require('./emailService');
const certificateService = require('./certificateService');
const notificationService = require('./notificationService');

/**
 * Get courses catalog with multi-parameter filtering, search, and pagination
 */
const getCourses = async ({
  search = '',
  category = 'All',
  level = 'All',
  priceFilter = 'All', // 'All', 'Free', 'Paid'
  limit = 20,
  page = 1,
  includeUnpublished = false,
} = {}) => {
  const query = {};

  if (!includeUnpublished) {
    query.published = true;
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (level && level !== 'All') {
    query.level = level;
  }

  if (priceFilter === 'Free') {
    query.price = 0;
  } else if (priceFilter === 'Paid') {
    query.price = { $gt: 0 };
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { instructorName: searchRegex },
      { category: searchRegex },
    ];
  }

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  return {
    courses,
    pagination: {
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit) || 1,
      limit: parseInt(limit, 10),
    },
  };
};

/**
 * Get single course by ID or Slug
 */
const getCourseByIdOrSlug = async (idOrSlug) => {
  let course = null;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    course = await Course.findById(idOrSlug).populate('instructorId', 'name email role');
  }
  if (!course) {
    course = await Course.findOne({ slug: idOrSlug.toLowerCase() }).populate('instructorId', 'name email role');
  }
  return course;
};

/**
 * Enroll learner into course (Free course instant enrollment; Paid course checks payment)
 */
const enrollInCourse = async (learnerId, courseId) => {
  const [learner, course] = await Promise.all([
    User.findById(learnerId),
    Course.findById(courseId),
  ]);

  if (!learner) throw new Error('Learner user not found');
  if (!course) throw new Error('Course not found');
  if (!course.published) throw new Error('This course is not currently open for enrollment');

  // Check if existing enrollment exists
  let enrollment = await Enrollment.findOne({ learnerId, courseId });
  if (enrollment) {
    if (enrollment.paymentStatus === 'paid' || enrollment.paymentStatus === 'free') {
      return {
        isAlreadyEnrolled: true,
        enrollment,
        message: 'You are already actively enrolled in this course.',
      };
    }
  }

  // If Course is Free (Price === 0)
  if (course.price === 0) {
    if (!enrollment) {
      try {
        enrollment = await Enrollment.create({
          learnerId,
          courseId,
          status: 'enrolled',
          paymentStatus: 'free',
          progress: 0,
          completedLessons: [],
          enrolledAt: new Date(),
        });

        // Update course count
        course.enrolledCount = (course.enrolledCount || 0) + 1;
        await course.save();
      } catch (err) {
        if (err.code === 11000) {
          enrollment = await Enrollment.findOne({ learnerId, courseId });
          if (enrollment) {
            enrollment.paymentStatus = 'free';
            enrollment.status = 'enrolled';
            await enrollment.save();
          }
        } else {
          throw err;
        }
      }
    } else {
      enrollment.paymentStatus = 'free';
      enrollment.status = 'enrolled';
      await enrollment.save();
    }

    // Trigger Notification & Email
    await notificationService.createNotification({
      recipientId: learnerId,
      type: 'course_enrolled',
      title: 'Course Enrollment Confirmed!',
      message: `You have successfully enrolled in "${course.title}". Start learning today!`,
      relatedCourseId: course._id,
      link: `/courses/${course._id}/learn`,
    });

    try {
      await emailService.sendEnrollmentConfirmation({ learner, course, enrollment });
    } catch (mailErr) {
      console.warn('[courseService] Enrollment email log failed:', mailErr.message);
    }

    return {
      isAlreadyEnrolled: false,
      enrollment,
      message: `Successfully enrolled in ${course.title}!`,
    };
  }

  // Course is Paid: Return payment initiation prompt
  return {
    requiresPayment: true,
    courseId: course._id,
    courseTitle: course.title,
    price: course.price,
    currency: course.currency || 'USD',
    message: 'This is a premium course requiring payment before access is granted.',
  };
};

/**
 * Track learner lesson progress
 */
const updateLessonProgress = async (learnerId, courseId, lessonId, isCompleted = true) => {
  const enrollment = await Enrollment.findOne({ learnerId, courseId });
  if (!enrollment) {
    throw new Error('You are not enrolled in this course.');
  }

  if (enrollment.paymentStatus === 'pending') {
    throw new Error('Course access is locked pending payment confirmation.');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found.');
  }

  // Verify lesson exists in course
  const validLesson = course.curriculum.find((l) => l.lessonId === lessonId);
  if (!validLesson) {
    throw new Error(`Lesson ID '${lessonId}' is not part of this course curriculum.`);
  }

  const completedSet = new Set(enrollment.completedLessons || []);
  if (isCompleted) {
    completedSet.add(lessonId);
  } else {
    completedSet.delete(lessonId);
  }

  enrollment.completedLessons = Array.from(completedSet);

  // Recalculate progress percentage
  const totalLessons = course.curriculum.length || 1;
  const progressPercent = Math.min(100, Math.round((enrollment.completedLessons.length / totalLessons) * 100));
  enrollment.progress = progressPercent;

  if (enrollment.status === 'enrolled' && progressPercent > 0) {
    enrollment.status = 'in_progress';
  }

  await enrollment.save();

  return {
    enrollmentId: enrollment._id,
    progress: enrollment.progress,
    completedLessons: enrollment.completedLessons,
    totalLessons,
    isEligibleForCompletion: enrollment.completedLessons.length >= totalLessons,
  };
};

/**
 * Server-Enforced Course Completion & Certificate Generation
 */
const completeCourse = async (learnerId, courseId, assessmentAnswers = {}) => {
  const [learner, course, enrollment] = await Promise.all([
    User.findById(learnerId),
    Course.findById(courseId),
    Enrollment.findOne({ learnerId, courseId }),
  ]);

  if (!learner) throw new Error('Learner not found.');
  if (!course) throw new Error('Course not found.');
  if (!enrollment) throw new Error('No active enrollment found for this course.');

  if (enrollment.paymentStatus !== 'free' && enrollment.paymentStatus !== 'paid') {
    throw new Error('Paid course access must be confirmed before completion can be registered.');
  }

  // 1. Enforce Lesson Requirements: All required curriculum lessons must be marked complete
  const requiredLessons = course.curriculum.filter((l) => l.isRequired !== false);
  const completedLessonSet = new Set(enrollment.completedLessons || []);
  const missingLessons = requiredLessons.filter((l) => !completedLessonSet.has(l.lessonId));

  if (missingLessons.length > 0) {
    throw new Error(
      `Cannot complete course yet. ${missingLessons.length} required lesson(s) remain unfinished: ${missingLessons
        .map((l) => l.title)
        .join(', ')}`
    );
  }

  // 2. Enforce Assessment Requirement: If course has assessment and requires passing
  let scoreAchieved = 100;
  if (course.completionRequirements?.requireAssessmentPass && course.assessment && course.assessment.length > 0) {
    let correctCount = 0;
    const totalQuestions = course.assessment.length;

    course.assessment.forEach((q) => {
      const userAnswer = assessmentAnswers[q.questionId];
      if (userAnswer && String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        correctCount += 1;
      }
    });

    scoreAchieved = Math.round((correctCount / totalQuestions) * 100);
    const passingScore = course.completionRequirements.passingScore || 70;

    if (scoreAchieved < passingScore) {
      throw new Error(
        `Assessment score of ${scoreAchieved}% is below the required passing threshold of ${passingScore}%. Please review the lessons and retake the assessment.`
      );
    }

    enrollment.assessmentScore = scoreAchieved;
    enrollment.assessmentPassed = true;
  }

  // 3. Mark Course Complete in DB
  enrollment.status = 'completed';
  enrollment.progress = 100;
  enrollment.completedAt = new Date();
  await enrollment.save();

  // 4. Issue Official Certificate
  const certificate = await certificateService.issueCertificate({
    learnerId,
    courseId,
    enrollmentId: enrollment._id,
    score: scoreAchieved,
  });

  // 5. In-App Notifications
  await notificationService.createNotification({
    recipientId: learnerId,
    type: 'course_completed',
    title: '🏆 Course Completed — Certificate Issued!',
    message: `Congratulations! You have completed "${course.title}". Your official Certificate (ID: ${certificate.certificateId}) is ready.`,
    relatedCourseId: course._id,
    link: `/certificates`,
  });

  await notificationService.createNotification({
    recipientId: learnerId,
    type: 'payment_success',
    title: '💳 Payment & Course Settlement Confirmed',
    message: `Payment and enrollment settlement verified for "${course.title}". Zero balance due.`,
    relatedCourseId: course._id,
    link: `/certificates`,
  });

  // 6. Automatic Emails: Course Completion, Payment Completion Settlement, & Certificate
  try {
    // 6a. Course Completion Email
    await emailService.sendCourseCompletion({ learner, course, enrollment, certificate });

    // 6b. Payment Completion Email
    let paymentOrder = null;
    if (enrollment.paymentOrderId) {
      paymentOrder = await PaymentOrder.findById(enrollment.paymentOrderId);
    }
    if (!paymentOrder) {
      paymentOrder = await PaymentOrder.findOne({ learnerId, courseId }).sort({ createdAt: -1 });
    }

    await emailService.sendPaymentCompletion({ learner, course, enrollment, paymentOrder, certificate });

    // 6c. Certificate Issued Email
    await emailService.sendCertificateIssued({ learner, course, certificate });
  } catch (mailErr) {
    console.warn('[courseService] Completion email dispatch notice:', mailErr.message);
  }

  return {
    status: 'completed',
    progress: 100,
    score: scoreAchieved,
    certificateId: certificate.certificateId,
    verificationUrl: certificate.verificationUrl,
    downloadUrl: `/api/certificates/${certificate.certificateId}/download`,
    message: `Congratulations! You have successfully completed "${course.title}".`,
  };
};

/**
 * Get all courses enrolled by learner with progress and certificate links
 */
const getLearnerCourses = async (learnerId) => {
  const enrollments = await Enrollment.find({ learnerId })
    .populate('courseId')
    .populate('certificateId')
    .sort({ updatedAt: -1 });

  return enrollments;
};

module.exports = {
  getCourses,
  getCourseByIdOrSlug,
  enrollInCourse,
  updateLessonProgress,
  completeCourse,
  getLearnerCourses,
};
