const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
  },
  { _id: false }
);

const learnerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    education: {
      type: String,
      default: '',
    },
    careerGoal: {
      type: String,
      default: '',
    },
    skills: {
      type: [skillSchema],
      default: [],
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for profilePicture compatibility
learnerProfileSchema.virtual('profilePicture').get(function () {
  return this.profileImage;
}).set(function (val) {
  this.profileImage = val;
});

learnerProfileSchema.set('toJSON', { virtuals: true });
learnerProfileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LearnerProfile', learnerProfileSchema);
