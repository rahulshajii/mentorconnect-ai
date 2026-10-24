const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createCourse,
  updateCourse,
  getAllEnrollments,
  getAllPayments,
  getAllCertificates,
  getAllEmailLogs,
} = require('../controllers/adminController');

// All routes here require admin role
router.post('/courses', protect, authorizeRoles('admin'), createCourse);
router.put('/courses/:id', protect, authorizeRoles('admin'), updateCourse);
router.get('/enrollments', protect, authorizeRoles('admin'), getAllEnrollments);
router.get('/payments', protect, authorizeRoles('admin'), getAllPayments);
router.get('/certificates', protect, authorizeRoles('admin'), getAllCertificates);
router.get('/emails', protect, authorizeRoles('admin'), getAllEmailLogs);

module.exports = router;
