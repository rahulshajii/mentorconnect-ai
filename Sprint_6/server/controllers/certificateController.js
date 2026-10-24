const Certificate = require('../models/Certificate');
const certificateService = require('../services/certificateService');

// @desc    Get current learner's earned certificates
// @route   GET /api/certificates/my
// @access  Private (Learner)
const getMyCertificates = async (req, res, next) => {
  try {
    const certs = await certificateService.getLearnerCertificates(req.user._id);
    res.status(200).json(certs);
  } catch (error) {
    next(error);
  }
};

// @desc    Public verification of certificate by certificateId
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const result = await certificateService.verifyCertificateById(req.params.certificateId);
    if (!result.isValid) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Download Certificate as high-res PDF
// @route   GET /api/certificates/:certificateId/download
// @access  Public / Authenticated
const downloadCertificatePdf = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('courseId')
      .populate('learnerId', 'name');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    if (certificate.status !== 'issued') {
      return res.status(403).json({ message: `Cannot download certificate: status is '${certificate.status}'` });
    }

    const pdfBuffer = await certificateService.buildCertificatePdfBuffer({
      certificateId: certificate.certificateId,
      learnerName: certificate.learnerName,
      courseTitle: certificate.courseTitle,
      instructorName: certificate.instructorName,
      duration: certificate.duration,
      score: certificate.score,
      completionDate: certificate.completionDate,
      issuedAt: certificate.issuedAt,
      verificationUrl: certificate.verificationUrl,
    });

    const safeFilename = `MentorConnect_Certificate_${certificate.certificateId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCertificates,
  verifyCertificate,
  downloadCertificatePdf,
};
