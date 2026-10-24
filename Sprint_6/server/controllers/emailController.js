const emailService = require('../services/emailService');

// @desc    Get email service delivery status and logs preview
// @route   GET /api/email/status
// @access  Public / Protected
const getEmailStatus = async (req, res, next) => {
  try {
    const isConfigured = emailService.isSmtpConfigured();
    const logsData = await emailService.getEmailLogs({ limit: 25 });

    res.status(200).json({
      service: 'MentorConnect AI Automated Email Dispatcher',
      smtpConfigured: isConfigured,
      mode: isConfigured ? 'Live SMTP Provider' : 'Simulated Development Fallback',
      totalLogs: logsData.totalLogs,
      recentLogs: logsData.logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retry a failed email delivery
// @route   POST /api/email/:id/retry
// @access  Private (Admin)
const retryEmail = async (req, res, next) => {
  try {
    const updatedLog = await emailService.retryFailedEmail(req.params.id);
    res.status(200).json({
      message: 'Email retry attempt completed',
      log: updatedLog,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmailStatus,
  retryEmail,
};
