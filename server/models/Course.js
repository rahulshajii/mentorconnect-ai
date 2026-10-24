const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    lessonId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '15 mins',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 1,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const assessmentQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    instructorName: {
      type: String,
      default: 'MentorConnect Master Faculty',
    },
    instructorTitle: {
      type: String,
      default: 'Principal Staff Engineer & Technical Mentor',
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Web Development', 'Cloud & DevOps', 'Data & AI', 'System Design', 'Cybersecurity', 'General'],
      default: 'Web Development',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    duration: {
      type: String,
      default: '6 Hours',
    },
    price: {
      type: Number,
      required: [true, 'Please set a price (0 for free)'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    learningObjectives: {
      type: [String],
      default: [],
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    curriculum: {
      type: [lessonSchema],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
    completionRequirements: {
      minLessonPercentage: {
        type: Number,
        default: 100,
      },
      requireAssessmentPass: {
        type: Boolean,
        default: true,
      },
      passingScore: {
        type: Number,
        default: 70,
      },
    },
    assessment: {
      type: [assessmentQuestionSchema],
      default: [],
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for isFree
courseSchema.virtual('isFree').get(function () {
  return this.price === 0;
});

courseSchema.index({ category: 1, level: 1, published: 1, price: 1 });
courseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
