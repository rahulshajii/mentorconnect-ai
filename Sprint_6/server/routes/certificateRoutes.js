const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getMyCertificates,
  verifyCertificate,
  downloadCertificatePdf,
} = require('../controllers/certificateController');

// Specific /my route before parameter routes
router.get('/my', protect, authorizeRoles('learner'), getMyCertificates);

// Public verification
router.get('/verify/:certificateId', verifyCertificate);

// PDF Download
router.get('/:certificateId/download', downloadCertificatePdf);

module.exports = router;
