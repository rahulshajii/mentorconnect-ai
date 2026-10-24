const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getCourses,
  getCourseById,
  enrollInCourse,
  getMyCourses,
  updateLessonProgress,
  completeCourse,
} = require('../controllers/courseController');

// Public routes
router.get('/', getCourses);

// Protected learner routes (Specific route /my MUST come before parameterized /:id)
router.get('/my', protect, authorizeRoles('learner'), getMyCourses);

// Course by ID
router.get('/:id', getCourseById);

// Course enrollment & learning actions
router.post('/:id/enroll', protect, authorizeRoles('learner'), enrollInCourse);
router.put('/:id/lessons/:lessonId/progress', protect, authorizeRoles('learner'), updateLessonProgress);
router.post('/:id/complete', protect, authorizeRoles('learner'), completeCourse);

module.exports = router;
