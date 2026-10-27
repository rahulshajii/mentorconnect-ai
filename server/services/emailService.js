const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');
const {
  getEnrollmentEmail,
  getPaymentReceiptEmail,
  getCourseCompletionEmail,
  getCertificateIssuedEmail,
  getPaymentCompletionEmail,
} = require('./emailTemplates');

// Initialize transporter if SMTP credentials are provided
let transporter = null;
let isSmtpConfigured = false;

const initTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: user,
          pass: pass,
        },
      });
      isSmtpConfigured = true;
      console.log('✅ Email Service: SMTP Transporter configured.');
    } catch (err) {
      console.warn('⚠️ Email Service Warning: Failed to initialize SMTP transporter:', err.message);
      isSmtpConfigured = false;
    }
  } else {
    isSmtpConfigured = false;
    console.log('ℹ️ Email Service: SMTP credentials not provided. Operating in safe Simulated Dev Mode.');
  }
};

initTransporter();

/**
 * Core dispatch function that records email events and attempts real SMTP transmission
 */
const dispatchEmail = async ({ recipient, recipientName, eventType, relatedEntityId, subject, html, text, meta = {} }) => {
  if (!recipient) {
    console.warn('[EmailService] Dispatch skipped: No recipient provided.');
    return null;
  }

  // Idempotency: Avoid sending the same confirmation email multiple times for the same event & entity
  if (relatedEntityId) {
    const existingLog = await EmailLog.findOne({
      recipient: recipient.toLowerCase(),
      eventType,
      relatedEntityId,
      status: { $in: ['sent', 'simulated_dev'] },
    });

    if (existingLog) {
      console.log(`[EmailService] Idempotency: Email already dispatched for ${eventType} on entity ${relatedEntityId}`);
      return existingLog;
    }
  }

  const fromAddress = process.env.EMAIL_FROM || 'MentorConnect AI <no-reply@mentorconnect.ai>';
  let logRecord = null;

  if (isSmtpConfigured && transporter) {
    try {
      const mailOptions = {
        from: fromAddress,
        to: recipient,
        subject: subject,
        text: text,
        html: html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Real email sent to ${recipient}: Message ID ${info.messageId}`);

      logRecord = await EmailLog.create({
        recipient: recipient.toLowerCase(),
        recipientName: recipientName || '',
        eventType,
        relatedEntityId: relatedEntityId || '',
        subject,
        bodyPreview: text.substring(0, 200),
        status: 'sent',
        meta: { ...meta, messageId: info.messageId },
        sentAt: new Date(),
      });
    } catch (err) {
      console.error(`[EmailService] SMTP delivery failed to ${recipient}: ${err.message}`);

      logRecord = await EmailLog.create({
        recipient: recipient.toLowerCase(),
        recipientName: recipientName || '',
        eventType,
        relatedEntityId: relatedEntityId || '',
        subject,
        bodyPreview: text.substring(0, 200),
        status: 'failed',
        lastError: err.message,
        meta,
      });
    }
  } else {
    // Development fallback: Log email safely
    console.log(`[EmailService: Simulated Dev Mode] [${eventType.toUpperCase()}] To: ${recipient} | Subject: "${subject}"`);

    logRecord = await EmailLog.create({
      recipient: recipient.toLowerCase(),
      recipientName: recipientName || '',
      eventType,
      relatedEntityId: relatedEntityId || '',
      subject,
      bodyPreview: text.substring(0, 200),
      status: 'simulated_dev',
      meta: {
        ...meta,
        devNotice: 'SMTP credentials not configured. Email recorded in Simulated Dev Mode.',
      },
      sentAt: new Date(),
    });
  }

  return logRecord;
};

const getFrontendUrl = () => (process.env.APP_BASE_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');

// 1. Send Enrollment Confirmation
const sendEnrollmentConfirmation = async ({ learner, course, enrollment }) => {
  const baseUrl = getFrontendUrl();
  const template = getEnrollmentEmail({
    learnerName: learner.name,
    courseName: course.title,
    instructorName: course.instructorName || 'MentorConnect Faculty',
    enrollmentId: enrollment._id.toString(),
    enrolledAt: enrollment.enrolledAt,
    courseDuration: course.duration,
    courseUrl: `${baseUrl}/courses/${course._id}/learn`,
  });

  return await dispatchEmail({
    recipient: learner.email,
    recipientName: learner.name,
    eventType: 'enrollment_confirmation',
    relatedEntityId: enrollment._id.toString(),
    subject: template.subject,
    html: template.html,
    text: template.text,
    meta: { courseId: course._id.toString(), enrollmentId: enrollment._id.toString() },
  });
};

// 2. Send Demo Payment Receipt
const sendPaymentReceipt = async ({ learner, course, paymentOrder }) => {
  const baseUrl = getFrontendUrl();
  const template = getPaymentReceiptEmail({
    learnerName: learner.name,
    courseName: course.title,
    orderId: paymentOrder.orderId,
    transactionReference: paymentOrder.transactionReference,
    amount: paymentOrder.amount,
    currency: paymentOrder.currency,
    paidAt: paymentOrder.paidAt || new Date(),
    courseUrl: `${baseUrl}/courses/${course._id}/learn`,
  });

  return await dispatchEmail({
    recipient: learner.email,
    recipientName: learner.name,
    eventType: 'payment_receipt',
    relatedEntityId: paymentOrder._id.toString(),
    subject: template.subject,
    html: template.html,
    text: template.text,
    meta: {
      orderId: paymentOrder.orderId,
      transactionReference: paymentOrder.transactionReference,
      amount: paymentOrder.amount,
      courseId: course._id.toString(),
    },
  });
};

// 3. Send Course Completion & Certificate Notification
const sendCourseCompletion = async ({ learner, course, enrollment, certificate }) => {
  const baseUrl = getFrontendUrl();
  const template = getCourseCompletionEmail({
    learnerName: learner.name,
    courseName: course.title,
    completedAt: enrollment.completedAt || new Date(),
    score: enrollment.assessmentScore,
    certificateId: certificate.certificateId,
    certificateDownloadUrl: `${baseUrl}/api/certificates/${certificate.certificateId}/download`,
    dashboardUrl: `${baseUrl}/learner/dashboard`,
  });

  return await dispatchEmail({
    recipient: learner.email,
    recipientName: learner.name,
    eventType: 'course_completion',
    relatedEntityId: certificate.certificateId,
    subject: template.subject,
    html: template.html,
    text: template.text,
    meta: {
      certificateId: certificate.certificateId,
      courseId: course._id.toString(),
      enrollmentId: enrollment._id.toString(),
    },
  });
};

// 4. Send Certificate Issued
const sendCertificateIssued = async ({ learner, course, certificate }) => {
  const baseUrl = getFrontendUrl();
  const template = getCertificateIssuedEmail({
    learnerName: learner.name,
    courseName: course.title,
    certificateId: certificate.certificateId,
    issueDate: certificate.issuedAt || new Date(),
    verificationUrl: `${baseUrl}/verify-certificate/${certificate.certificateId}`,
    downloadUrl: `${baseUrl}/api/certificates/${certificate.certificateId}/download`,
  });

  return await dispatchEmail({
    recipient: learner.email,
    recipientName: learner.name,
    eventType: 'certificate_issued',
    relatedEntityId: certificate.certificateId,
    subject: template.subject,
    html: template.html,
    text: template.text,
    meta: {
      certificateId: certificate.certificateId,
      courseId: course._id.toString(),
    },
  });
};

// 5. Send Payment & Course Completion Settlement Notification
const sendPaymentCompletion = async ({ learner, course, enrollment, paymentOrder, certificate }) => {
  const baseUrl = getFrontendUrl();
  const orderId = paymentOrder?.orderId || `ORD-${new Date().getFullYear()}-${enrollment._id.toString().substring(0, 6).toUpperCase()}`;
  const txnRef = paymentOrder?.transactionReference || `TXN-SETTLED-${enrollment._id.toString().substring(0, 6).toUpperCase()}`;
  const amount = paymentOrder?.amount !== undefined ? paymentOrder.amount : course.price || 0;
  const currency = paymentOrder?.currency || course.currency || 'USD';
  const paidAt = paymentOrder?.paidAt || enrollment.completedAt || new Date();

  const template = getPaymentCompletionEmail({
    learnerName: learner.name,
    courseName: course.title,
    orderId,
    transactionReference: txnRef,
    amount,
    currency,
    paidAt,
    certificateId: certificate?.certificateId || '',
    certificateDownloadUrl: certificate?.certificateId ? `${baseUrl}/api/certificates/${certificate.certificateId}/download` : '',
    dashboardUrl: `${baseUrl}/learner/dashboard`,
  });

  return await dispatchEmail({
    recipient: learner.email,
    recipientName: learner.name,
    eventType: 'payment_completion',
    relatedEntityId: `${enrollment._id.toString()}_payment_completion`,
    subject: template.subject,
    html: template.html,
    text: template.text,
    meta: {
      orderId,
      transactionReference: txnRef,
      amount,
      courseId: course._id.toString(),
      enrollmentId: enrollment._id.toString(),
      certificateId: certificate?.certificateId || '',
    },
  });
};

// 6. Admin Retry Failed Delivery
const retryFailedEmail = async (emailLogId) => {
  const log = await EmailLog.findById(emailLogId);
  if (!log) {
    throw new Error('Email log entry not found');
  }

  log.attemptCount += 1;

  if (isSmtpConfigured && transporter) {
    try {
      const fromAddress = process.env.EMAIL_FROM || 'MentorConnect AI <no-reply@mentorconnect.ai>';
      const info = await transporter.sendMail({
        from: fromAddress,
        to: log.recipient,
        subject: log.subject,
        text: log.bodyPreview,
      });

      log.status = 'sent';
      log.lastError = null;
      log.sentAt = new Date();
      log.meta = { ...log.meta, retryMessageId: info.messageId };
    } catch (err) {
      log.status = 'failed';
      log.lastError = err.message;
    }
  } else {
    log.status = 'simulated_dev';
    log.lastError = null;
    log.sentAt = new Date();
    log.meta = { ...log.meta, retryNotice: 'Retried in simulated dev mode.' };
  }

  await log.save();
  return log;
};

// Get recent email logs for status check
const getEmailLogs = async ({ limit = 50, recipient = null } = {}) => {
  const query = {};
  if (recipient) query.recipient = recipient.toLowerCase();

  const logs = await EmailLog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);

  return {
    isSmtpConfigured,
    totalLogs: logs.length,
    logs,
  };
};

module.exports = {
  isSmtpConfigured: () => isSmtpConfigured,
  sendEnrollmentConfirmation,
  sendPaymentReceipt,
  sendPaymentCompletion,
  sendCourseCompletion,
  sendCertificateIssued,
  retryFailedEmail,
  getEmailLogs,
};
