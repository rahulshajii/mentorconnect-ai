const express = require('express');
const router = express.Router();
const skillGapController = require('../controllers/skillGapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, skillGapController.getSkillGap);

module.exports = router;
