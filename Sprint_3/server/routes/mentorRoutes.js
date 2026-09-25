const express = require('express');
const { getMentors, getMentorById } = require('../controllers/profileController');

const router = express.Router();

router.get('/', getMentors);
router.get('/:id', getMentorById);

module.exports = router;
