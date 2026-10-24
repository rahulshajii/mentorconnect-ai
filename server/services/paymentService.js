const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const PaymentOrder = require('../models/PaymentOrder');
const User = require('../models/User');
const emailService = require('./emailService');
const notificationService = require('./notificationService');

/**
 * Generate a unique order identifier
 */
const generateOrderId = () => {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `ORD-${year}-${rand}`;
};

/**
 * Generate simulated transaction reference
 */
const generateTransactionRef = () => {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TXN-DEMO-${time}-${rand}`;
};

/**
 * Create Demo Payment Order (Price derived strictly from database)
 */
const createDemoOrder = async (learnerId, courseId) => {
  const [learner, course] = await Promise.all([
    User.findById(learnerId),
    Course.findById(courseId),
  ]);

  if (!learner) throw new Error('Learner not found');
  if (!course) throw new Error('Course not found');
  if (!course.published) throw new Error('This course is not open for enrollment');

  // Check if learner is already enrolled and paid
  const existingEnrollment = await Enrollment.findOne({ learnerId, courseId });
  if (existingEnrollment && (existingEnrollment.paymentStatus === 'paid' || existingEnrollment.paymentStatus === 'free')) {
    return {
      alreadyEnrolled: true,
      message: 'You are already actively enrolled in this course.',
      courseId: course._id,
    };
  }

  // Idempotency: Reuse pending order if one exists within last 24 hours
  let order = await PaymentOrder.findOne({
    learnerId,
    courseId,
    status: 'pending',
  }).sort({ createdAt: -1 });

  if (!order) {
    const orderId = generateOrderId();
    order = await PaymentOrder.create({
      learnerId,
      courseId,
      orderId,
      amount: course.price, // STRICT SERVER-FETCHED PRICE
      currency: course.currency || 'USD',
      paymentType: 'DEMO',
      status: 'pending',
    });
  }

  // Ensure an enrollment record exists in pending state
  let enrollment = existingEnrollment;
  if (!enrollment) {
    try {
      enrollment = await Enrollment.create({
        learnerId,
        courseId,
        status: 'enrolled',
        paymentStatus: 'pending',
        paymentOrderId: order._id,
        progress: 0,
        completedLessons: [],
      });
    } catch (err) {
      if (err.code === 11000) {
        enrollment = await Enrollment.findOne({ learnerId, courseId });
        if (enrollment) {
          enrollment.paymentOrderId = order._id;
          await enrollment.save();
        }
      } else {
        throw err;
      }
    }
  } else {
    enrollment.paymentOrderId = order._id;
    await enrollment.save();
  }

  order.enrollmentId = enrollment._id;
  await order.save();

  return {
    orderId: order.orderId,
    amount: order.amount,
    currency: order.currency,
    paymentType: 'DEMO',
    course: {
      _id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      instructorName: course.instructorName || 'MentorConnect Faculty',
      price: course.price,
      duration: course.duration,
      category: course.category,
      level: course.level,
    },
    learner: {
      name: learner.name,
      email: learner.email,
    },
    notice: 'Demo Payment — No real money will be charged. This is an academic simulation.',
  };
};

/**
 * Confirm Demo Payment (Idempotent execution with transaction ref & email triggers)
 */
const confirmDemoPayment = async (learnerId, orderId) => {
  const order = await PaymentOrder.findOne({ orderId })
    .populate('courseId')
    .populate('learnerId', 'name email');

  if (!order) {
    throw new Error(`Order '${orderId}' not found.`);
  }

  // Verify ownership
  if (order.learnerId._id.toString() !== learnerId.toString()) {
    throw new Error('Unauthorized: You do not own this order.');
  }

  const course = order.courseId;
  const learner = order.learnerId;

  // Idempotent Check: If already succeeded, return immediately without duplicate processing
  if (order.status === 'succeeded') {
    return {
      success: true,
      isDuplicateConfirmation: true,
      orderId: order.orderId,
      transactionReference: order.transactionReference,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.title,
      paidAt: order.paidAt,
      message: 'Payment has already been confirmed.',
    };
  }

  // 1. Mark Order Succeeded
  const txnRef = generateTransactionRef();
  order.status = 'succeeded';
  order.transactionReference = txnRef;
  order.paidAt = new Date();
  await order.save();

  // 2. Grant Paid Access in Enrollment
  let enrollment = await Enrollment.findOne({ learnerId, courseId: course._id });
  if (!enrollment) {
    try {
      enrollment = await Enrollment.create({
        learnerId,
        courseId: course._id,
        status: 'enrolled',
        paymentStatus: 'paid',
        paymentOrderId: order._id,
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date(),
      });
    } catch (err) {
      if (err.code === 11000) {
        enrollment = await Enrollment.findOne({ learnerId, courseId: course._id });
        if (enrollment) {
          enrollment.paymentStatus = 'paid';
          enrollment.paymentOrderId = order._id;
          if (enrollment.status !== 'completed') {
            enrollment.status = 'enrolled';
          }
          await enrollment.save();
        }
      } else {
        throw err;
      }
    }
  } else {
    enrollment.paymentStatus = 'paid';
    enrollment.paymentOrderId = order._id;
    if (enrollment.status !== 'completed') {
      enrollment.status = 'enrolled';
    }
    await enrollment.save();
  }

  // Increment enrolledCount
  course.enrolledCount = (course.enrolledCount || 0) + 1;
  await course.save();

  // 3. Trigger In-App Notification
  await notificationService.createNotification({
    recipientId: learnerId,
    type: 'payment_success',
    title: 'Payment Successful (Demo)',
    message: `Your simulated payment of $${order.amount} for "${course.title}" was verified. Full course access granted!`,
    relatedCourseId: course._id,
    link: `/courses/${course._id}/learn`,
  });

  // 4. Trigger Automatic Emails: Demo Receipt + Enrollment Confirmation
  let receiptEmailStatus = 'logged';
  try {
    const log1 = await emailService.sendPaymentReceipt({ learner, course, paymentOrder: order });
    const log2 = await emailService.sendEnrollmentConfirmation({ learner, course, enrollment });
    receiptEmailStatus = log1?.status || 'logged';
  } catch (mailErr) {
    console.warn('[paymentService] Email logging notice:', mailErr.message);
  }

  return {
    success: true,
    isDuplicateConfirmation: false,
    orderId: order.orderId,
    transactionReference: txnRef,
    amount: order.amount,
    currency: order.currency,
    courseTitle: course.title,
    courseId: course._id,
    enrollmentId: enrollment._id,
    status: 'succeeded',
    paidAt: order.paidAt,
    emailStatus: receiptEmailStatus,
    message: 'Demo payment successfully verified and recorded!',
  };
};

/**
 * Get payment orders for learner
 */
const getLearnerOrders = async (learnerId) => {
  return await PaymentOrder.find({ learnerId })
    .populate('courseId', 'title thumbnail category price')
    .sort({ createdAt: -1 });
};

/**
 * Get order by ID (with ownership check)
 */
const getOrderById = async (learnerId, orderId) => {
  const order = await PaymentOrder.findOne({ orderId })
    .populate('courseId')
    .populate('learnerId', 'name email');

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.learnerId._id.toString() !== learnerId.toString()) {
    throw new Error('Unauthorized: You cannot view orders that belong to another learner');
  }

  return order;
};

module.exports = {
  createDemoOrder,
  confirmDemoPayment,
  getLearnerOrders,
  getOrderById,
};
