const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['enrolled', 'in_progress', 'completed'],
      default: 'enrolled',
    },
    paymentStatus: {
      type: String,
      enum: ['free', 'pending', 'paid'],
      default: 'free',
    },
    paymentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentOrder',
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    assessmentScore: {
      type: Number,
      default: null,
    },
    assessmentPassed: {
      type: Boolean,
      default: false,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollments for the same user and course
enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ learnerId: 1, status: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
