/**
 * Professional HTML Email Templates for MentorConnect AI
 */

const baseEmailWrapper = (title, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 24px; color: #191919; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e0e0e0; }
    .header { background: linear-gradient(135deg, #0a66c2 0%, #004182 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .info-box { background: #f8fafc; border-left: 4px solid #0a66c2; padding: 16px 20px; border-radius: 6px; margin: 20px 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 700; background: #e0f2fe; color: #0369a1; }
    .badge-demo { background: #fef3c7; color: #92400e; }
    .btn { display: inline-block; background-color: #0a66c2; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 24px; font-weight: 600; font-size: 15px; margin: 20px 0; text-align: center; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>MentorConnect AI</h1>
      <p>Adaptive Mentoring & Career Acceleration Platform</p>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MentorConnect AI. Platform-issued notification.</p>
      <p>This is an automated system notification. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
`;

// Email A: Course Enrollment Confirmation
const getEnrollmentEmail = ({ learnerName, courseName, instructorName, enrollmentId, enrolledAt, courseDuration, courseUrl }) => {
  const content = `
    <h2 style="color: #0a66c2; margin-top: 0;">🎉 Enrollment Confirmed!</h2>
    <p>Dear <strong>${learnerName}</strong>,</p>
    <p>Congratulations! You have successfully enrolled in <strong>${courseName}</strong>. Your personalized learning workspace is now ready.</p>
    
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Course:</td><td style="font-weight: 600;">${courseName}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Instructor:</td><td>${instructorName || 'MentorConnect Faculty'}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Enrollment ID:</td><td><code>${enrollmentId}</code></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Enrolled Date:</td><td>${new Date(enrolledAt).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Estimated Duration:</td><td>${courseDuration || 'Self-Paced'}</td></tr>
      </table>
    </div>

    <p><strong>Next Steps:</strong></p>
    <ol style="padding-left: 20px; color: #334155;">
      <li>Log in to your MentorConnect AI Learner Dashboard.</li>
      <li>Open <strong>My Courses</strong> and select <strong>Continue Learning</strong>.</li>
      <li>Complete lessons at your own pace and pass the course assessment to earn your verified Certificate of Completion.</li>
    </ol>

    <div style="text-align: center;">
      <a href="${courseUrl}" class="btn">Access Course Now</a>
    </div>
  `;
  return {
    subject: `Enrollment Confirmed — ${courseName}`,
    html: baseEmailWrapper(`Enrollment Confirmed — ${courseName}`, content),
    text: `Hello ${learnerName},\n\nYou have successfully enrolled in "${courseName}" on MentorConnect AI.\nEnrollment ID: ${enrollmentId}\nInstructor: ${instructorName}\nAccess Course: ${courseUrl}\n\nHappy Learning!`,
  };
};

// Email B: Demo Payment Receipt
const getPaymentReceiptEmail = ({ learnerName, courseName, orderId, transactionReference, amount, currency, paidAt, courseUrl }) => {
  const content = `
    <h2 style="color: #057642; margin-top: 0;">✅ Demo Payment Confirmation</h2>
    <div style="margin-bottom: 16px;">
      <span class="badge badge-demo">Simulated Academic Demo Payment</span>
    </div>
    <p>Dear <strong>${learnerName}</strong>,</p>
    <p>Thank you! Your simulated demo payment for <strong>${courseName}</strong> has been successfully verified and recorded.</p>
    
    <div class="info-box" style="border-left-color: #057642;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #0f172a;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Order Reference:</td><td><code>${orderId}</code></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Transaction Reference:</td><td><code>${transactionReference}</code></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Course:</td><td style="font-weight: 600;">${courseName}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Simulated Amount:</td><td style="font-weight: 700; color: #057642;">$${amount} ${currency || 'USD'} (DEMO)</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Transaction Date:</td><td>${new Date(paidAt).toLocaleString()}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Payment Method:</td><td>One-Click Demo Payment Simulation</td></tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #64748b; background: #fffbeb; padding: 10px 14px; border-radius: 6px; border: 1px solid #fef3c7;">
      <em>Notice:</em> This is an academic simulated payment. No real credit card or bank account was charged.
    </p>

    <div style="text-align: center;">
      <a href="${courseUrl}" class="btn" style="background-color: #057642;">Start Learning Now</a>
    </div>
  `;
  return {
    subject: `Demo Payment Confirmation — ${courseName} (${orderId})`,
    html: baseEmailWrapper(`Demo Payment Receipt — ${courseName}`, content),
    text: `Hello ${learnerName},\n\nYour simulated demo payment for "${courseName}" is confirmed.\nOrder ID: ${orderId}\nTransaction Ref: ${transactionReference}\nSimulated Amount: $${amount} (DEMO)\nAccess Course: ${courseUrl}`,
  };
};

// Email C: Course Completion Confirmation
const getCourseCompletionEmail = ({ learnerName, courseName, completedAt, score, certificateId, certificateDownloadUrl, dashboardUrl }) => {
  const content = `
    <h2 style="color: #7c3aed; margin-top: 0;">🎓 Congratulations! You Completed the Course</h2>
    <p>Dear <strong>${learnerName}</strong>,</p>
    <p>Outstanding achievement! You have satisfied all curriculum requirements and successfully passed the course assessment for <strong>${courseName}</strong>.</p>
    
    <div class="info-box" style="border-left-color: #7c3aed;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #0f172a;">Completion Details</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Course:</td><td style="font-weight: 600;">${courseName}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Completion Date:</td><td>${new Date(completedAt).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Assessment Score:</td><td style="font-weight: 700; color: #7c3aed;">${score ? `${score}%` : '100% (Completed)'}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Certificate ID:</td><td><code>${certificateId}</code></td></tr>
      </table>
    </div>

    <p>Your official verifiable completion certificate has been generated and added to your portfolio.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${certificateDownloadUrl}" class="btn" style="background-color: #7c3aed; margin-right: 12px;">Download PDF Certificate</a>
      <a href="${dashboardUrl}" class="btn" style="background-color: #0a66c2;">View Dashboard</a>
    </div>
  `;
  return {
    subject: `Congratulations! You Completed ${courseName}`,
    html: baseEmailWrapper(`Course Completed — ${courseName}`, content),
    text: `Congratulations ${learnerName}!\n\nYou have completed "${courseName}".\nCompletion Date: ${new Date(completedAt).toLocaleDateString()}\nCertificate ID: ${certificateId}\nDownload Certificate: ${certificateDownloadUrl}\nDashboard: ${dashboardUrl}`,
  };
};

// Email D: Certificate Issued
const getCertificateIssuedEmail = ({ learnerName, courseName, certificateId, issueDate, verificationUrl, downloadUrl }) => {
  const content = `
    <h2 style="color: #0a66c2; margin-top: 0;">📜 Your Official Certificate Has Been Issued</h2>
    <p>Dear <strong>${learnerName}</strong>,</p>
    <p>Your verified Certificate of Completion for <strong>${courseName}</strong> has been officially minted and registered in the MentorConnect AI verification registry.</p>
    
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Certificate ID:</td><td style="font-weight: 700; color: #0a66c2;"><code>${certificateId}</code></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Awarded To:</td><td style="font-weight: 600;">${learnerName}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Course Title:</td><td>${courseName}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Issue Date:</td><td>${new Date(issueDate).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Verification URL:</td><td><a href="${verificationUrl}" style="color: #0a66c2;">${verificationUrl}</a></td></tr>
      </table>
    </div>

    <p>You can share this credential on your LinkedIn profile, portfolio, and resume. Anyone with your certificate ID or link can verify its authenticity directly.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${downloadUrl}" class="btn">Download Official PDF</a>
      <a href="${verificationUrl}" class="btn" style="background: #ffffff; color: #0a66c2 !important; border: 1.5px solid #0a66c2; margin-left: 10px;">Verify Online</a>
    </div>
  `;
  return {
    subject: `Certificate Issued — ${courseName} (ID: ${certificateId})`,
    html: baseEmailWrapper(`Certificate Issued — ${certificateId}`, content),
    text: `Hello ${learnerName},\n\nYour official certificate for "${courseName}" is now issued.\nCertificate ID: ${certificateId}\nVerification Link: ${verificationUrl}\nDownload PDF: ${downloadUrl}`,
  };
};

// Email E: Payment & Course Completion Confirmation
const getPaymentCompletionEmail = ({
  learnerName,
  courseName,
  orderId,
  transactionReference,
  amount,
  currency,
  paidAt,
  certificateId,
  certificateDownloadUrl,
  dashboardUrl,
}) => {
  const content = `
    <h2 style="color: #057642; margin-top: 0;">💳 Payment Completed & Course Finished!</h2>
    <div style="margin-bottom: 16px;">
      <span class="badge" style="background: #dcfce7; color: #166534; font-weight: 700;">Account Fully Settled — 100% Completed</span>
    </div>
    <p>Dear <strong>${learnerName}</strong>,</p>
    <p>This is your official confirmation that your payment for <strong>${courseName}</strong> has been fully settled and your course curriculum is successfully 100% completed.</p>
    
    <div class="info-box" style="border-left-color: #057642;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #0f172a;">Payment & Completion Statement</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Course:</td><td style="font-weight: 600;">${courseName}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Order Reference:</td><td><code>${orderId}</code></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Transaction Reference:</td><td><code>${transactionReference}</code></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Payment Status:</td><td><strong style="color: #057642;">COMPLETED / SETTLED</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Amount Settled:</td><td style="font-weight: 700; color: #057642;">$${amount} ${currency || 'USD'}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Completion Date:</td><td>${new Date(paidAt).toLocaleDateString()}</td></tr>
        ${certificateId ? `<tr><td style="padding: 6px 0; color: #64748b;">Issued Certificate ID:</td><td><code style="color: #0a66c2;">${certificateId}</code></td></tr>` : ''}
      </table>
    </div>

    <p style="font-size: 13px; color: #166534; background: #f0fdf4; padding: 12px 16px; border-radius: 6px; border: 1px solid #bbf7d0;">
      ✓ Your account has zero balance due. Your verified certificate and learning record are officially sealed in your permanent portfolio.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      ${certificateDownloadUrl ? `<a href="${certificateDownloadUrl}" class="btn" style="background-color: #057642; margin-right: 12px;">Download Certificate PDF</a>` : ''}
      <a href="${dashboardUrl}" class="btn" style="background-color: #0a66c2;">View Learner Dashboard</a>
    </div>
  `;

  return {
    subject: `Payment Completed & Course Finished — ${courseName}`,
    html: baseEmailWrapper(`Payment & Course Completion — ${courseName}`, content),
    text: `Hello ${learnerName},\n\nYour payment and course completion for "${courseName}" are confirmed.\nOrder ID: ${orderId}\nTransaction Ref: ${transactionReference}\nTotal Settled: $${amount} ${currency || 'USD'}\nStatus: COMPLETED / SETTLED\nCertificate ID: ${certificateId || 'N/A'}\nDashboard: ${dashboardUrl}`,
  };
};

module.exports = {
  getEnrollmentEmail,
  getPaymentReceiptEmail,
  getCourseCompletionEmail,
  getCertificateIssuedEmail,
  getPaymentCompletionEmail,
};
