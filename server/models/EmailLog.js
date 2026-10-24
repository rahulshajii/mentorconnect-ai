const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: [true, 'Recipient email is required'],
      lowercase: true,
      trim: true,
    },
    recipientName: {
      type: String,
      default: '',
    },
    eventType: {
      type: String,
      enum: [
        'enrollment_confirmation',
        'payment_receipt',
        'payment_completion',
        'course_completion',
        'certificate_issued',
        'session_booked',
        'system',
      ],
      required: true,
    },
    relatedEntityId: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    bodyPreview: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['sent', 'simulated_dev', 'queued', 'failed'],
      default: 'simulated_dev',
    },
    attemptCount: {
      type: Number,
      default: 1,
    },
    lastError: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

emailLogSchema.index({ recipient: 1, eventType: 1, createdAt: -1 });
emailLogSchema.index({ status: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
