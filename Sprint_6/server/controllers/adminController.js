const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const PaymentOrder = require('../models/PaymentOrder');
const Certificate = require('../models/Certificate');
const EmailLog = require('../models/EmailLog');
const User = require('../models/User');

// Create a new course
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      thumbnail,
      category,
      level,
      duration,
      price,
      currency,
      curriculum,
      learningObjectives,
      prerequisites,
      published,
      assessment,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const course = await Course.create({
      title,
      slug: `${slug}-${Date.now().toString(36)}`,
      description,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      category: category || 'Web Development',
      level: level || 'Intermediate',
      duration: duration || '6 Hours',
      price: Number(price) || 0,
      currency: currency || 'USD',
      curriculum: Array.isArray(curriculum) ? curriculum : [],
      learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : [],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
      published: published !== undefined ? published : true,
      assessment: Array.isArray(assessment) ? assessment : [],
      instructorId: req.user._id,
      instructorName: req.user.name,
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    next(error);
  }
};

// Update an existing course
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const fields = [
      'title',
      'description',
      'thumbnail',
      'category',
      'level',
      'duration',
      'price',
      'currency',
      'published',
      'curriculum',
      'learningObjectives',
      'prerequisites',
      'assessment',
      'completionRequirements',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    await course.save();
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    next(error);
  }
};

// View all enrollments
const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('learnerId', 'name email role')
      .populate('courseId', 'title category price thumbnail')
      .populate('certificateId', 'certificateId issuedAt')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

// View all demo payments
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await PaymentOrder.find()
      .populate('learnerId', 'name email')
      .populate('courseId', 'title category price')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

// View all certificates
const getAllCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find()
      .populate('learnerId', 'name email')
      .populate('courseId', 'title category')
      .sort({ issuedAt: -1 })
      .limit(100);

    res.status(200).json(certs);
  } catch (error) {
    next(error);
  }
};

// View email delivery logs
const getAllEmailLogs = async (req, res, next) => {
  try {
    const logs = await EmailLog.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  updateCourse,
  getAllEnrollments,
  getAllPayments,
  getAllCertificates,
  getAllEmailLogs,
};
