const mongoose = require('mongoose');

const expertiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const mentorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    experience: {
      type: Number,
      default: 1,
    },
    expertise: {
      type: [expertiseSchema],
      default: [],
    },
    sessionPrice: {
      type: Number,
      default: 50,
    },
    availability: {
      type: [String],
      default: ['Mon-Fri: 10:00 AM - 04:00 PM'],
    },
    rating: {
      type: Number,
      default: 5.0,
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
      default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
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

// Compatibility virtual for hourlyFee
mentorProfileSchema.virtual('hourlyFee').get(function () {
  return this.sessionPrice;
}).set(function (val) {
  this.sessionPrice = val;
});

mentorProfileSchema.set('toJSON', { virtuals: true });
mentorProfileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
