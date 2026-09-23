const express = require('express');
const { getMentors } = require('../controllers/profileController');

const router = express.Router();

router.get('/', getMentors);

module.exports = router;
