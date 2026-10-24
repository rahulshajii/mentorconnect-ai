const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getEmailStatus, retryEmail } = require('../controllers/emailController');

router.get('/status', getEmailStatus);
router.post('/:id/retry', protect, authorizeRoles('admin'), retryEmail);

module.exports = router;
