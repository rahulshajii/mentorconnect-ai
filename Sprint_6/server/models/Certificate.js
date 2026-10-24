const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: [true, 'Certificate ID is required'],
      trim: true,
    },
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
      required: [true, 'Enrollment ID is required'],
      unique: true,
    },
    learnerName: {
      type: String,
      required: [true, 'Learner name is required'],
      trim: true,
    },
    courseTitle: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    instructorName: {
      type: String,
      default: 'MentorConnect Master Faculty',
    },
    duration: {
      type: String,
      default: 'Self-Paced Comprehensive Course',
    },
    score: {
      type: Number,
      default: 100,
    },
    completionDate: {
      type: Date,
      default: Date.now,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['eligible', 'issued', 'revoked'],
      default: 'issued',
    },
    verificationUrl: {
      type: String,
      default: '',
    },
    issuer: {
      type: String,
      default: 'MentorConnect AI Academic Accreditation Board',
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ certificateId: 1 }, { unique: true });
certificateSchema.index({ learnerId: 1, courseId: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
