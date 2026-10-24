const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Learner ID is required'],
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentor ID is required'],
    },
    date: {
      type: String,
      required: [true, 'Session date is required (YYYY-MM-DD)'],
    },
    startTime: {
      type: String,
      required: [true, 'Session start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'Session end time is required'],
    },
    topic: {
      type: String,
      required: [true, 'Session topic is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
      default: 'pending',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries & preventing duplicate slot bookings
sessionSchema.index({ mentorId: 1, date: 1, startTime: 1, status: 1 });
sessionSchema.index({ learnerId: 1, status: 1 });

module.exports = mongoose.model('Session', sessionSchema);
