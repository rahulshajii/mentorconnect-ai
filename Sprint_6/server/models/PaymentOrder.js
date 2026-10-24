const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Learner ID is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      default: null,
    },
    orderId: {
      type: String,
      required: [true, 'Unique order ID is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentType: {
      type: String,
      enum: ['DEMO'],
      default: 'DEMO',
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionReference: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: 'One-Click Simulated Demo Payment',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentOrderSchema.index({ learnerId: 1, courseId: 1, status: 1 });
paymentOrderSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model('PaymentOrder', paymentOrderSchema);
