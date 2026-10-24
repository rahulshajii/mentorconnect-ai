const express = require('express');
const { getMentors, getMentorById } = require('../controllers/profileController');
const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/recommendations', protect, getRecommendations);
router.get('/', getMentors);
router.get('/:id', getMentorById);

module.exports = router;

