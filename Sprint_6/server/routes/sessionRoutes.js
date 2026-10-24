const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  bookSession,
  getLearnerSessions,
  getMentorSessions,
  updateSessionStatus,
  getMentorAvailability,
} = require('../controllers/sessionController');

router.post('/', protect, authorizeRoles('learner'), bookSession);
router.get('/my', protect, authorizeRoles('learner'), getLearnerSessions);
router.get('/mentor', protect, authorizeRoles('mentor'), getMentorSessions);
router.put('/:id/status', protect, updateSessionStatus);
router.get('/availability/:mentorId', protect, getMentorAvailability);

module.exports = router;
