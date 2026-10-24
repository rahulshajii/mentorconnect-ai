const courseService = require('../services/courseService');

// @desc    Get courses catalog with search and filters
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { search, category, level, price, limit, page } = req.query;
    const result = await courseService.getCourses({
      search,
      category,
      level,
      priceFilter: price,
      limit,
      page,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get course details by ID or Slug
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Learner)
const enrollInCourse = async (req, res, next) => {
  try {
    const result = await courseService.enrollInCourse(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get learner's enrolled courses with progress
// @route   GET /api/courses/my
// @access  Private (Learner)
const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await courseService.getLearnerCourses(req.user._id);
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson progress
// @route   PUT /api/courses/:id/lessons/:lessonId/progress
// @access  Private (Learner)
const updateLessonProgress = async (req, res, next) => {
  try {
    const { isCompleted } = req.body;
    const result = await courseService.updateLessonProgress(
      req.user._id,
      req.params.id,
      req.params.lessonId,
      isCompleted !== undefined ? isCompleted : true
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Complete course & issue certificate
// @route   POST /api/courses/:id/complete
// @access  Private (Learner)
const completeCourse = async (req, res, next) => {
  try {
    const { assessmentAnswers } = req.body;
    const result = await courseService.completeCourse(
      req.user._id,
      req.params.id,
      assessmentAnswers || {}
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  enrollInCourse,
  getMyCourses,
  updateLessonProgress,
  completeCourse,
};
