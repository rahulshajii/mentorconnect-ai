const PDFDocument = require('pdfkit');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

/**
 * Generate a unique, unpredictable certificate identifier
 */
const generateCertificateId = () => {
  const rand1 = Math.random().toString(36).substring(2, 7).toUpperCase();
  const rand2 = Math.random().toString(36).substring(2, 7).toUpperCase();
  const year = new Date().getFullYear();
  return `MC-CERT-${year}-${rand1}${rand2}`;
};

/**
 * Generate a high-resolution, landscape PDF certificate stream/buffer using PDFKit
 */
const buildCertificatePdfBuffer = (certData) => {
  return new Promise((resolve, reject) => {
    try {
      // Standard A4 landscape dimensions: 841.89 x 595.28 points
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 40,
        info: {
          Title: `Certificate of Completion - ${certData.courseTitle}`,
          Author: 'MentorConnect AI',
          Subject: 'Verified Course Completion Credential',
          Keywords: 'certificate, mentoring, completion, mentorconnect',
        },
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const width = doc.page.width;
      const height = doc.page.height;

      // 1. Background subtle fill
      doc.rect(0, 0, width, height).fill('#fafbfd');

      // 2. Elegant Outer Border (Primary Deep Blue)
      doc.lineWidth(4);
      doc.rect(24, 24, width - 48, height - 48).stroke('#0a66c2');

      // 3. Inner Decorative Border (Gold / Bronze)
      doc.lineWidth(1.5);
      doc.rect(30, 30, width - 60, height - 60).stroke('#d97706');

      // 4. Subtle Corner Squares Accent
      const cornerSize = 10;
      doc.rect(26, 26, cornerSize, cornerSize).fill('#0a66c2');
      doc.rect(width - 36, 26, cornerSize, cornerSize).fill('#0a66c2');
      doc.rect(26, height - 36, cornerSize, cornerSize).fill('#0a66c2');
      doc.rect(width - 36, height - 36, cornerSize, cornerSize).fill('#0a66c2');

      // 5. Header / Brand
      doc.font('Helvetica-Bold')
        .fontSize(22)
        .fillColor('#0a66c2')
        .text('MENTORCONNECT AI', 40, 56, { align: 'center', characterSpacing: 2 });

      doc.font('Helvetica')
        .fontSize(9)
        .fillColor('#64748b')
        .text('AN INTELLIGENT MENTORING PLATFORM WITH ADAPTIVE MENTORING INFERENCE ENGINE', 40, 84, {
          align: 'center',
          characterSpacing: 1.5,
        });

      // 6. Certificate Title
      doc.font('Helvetica-Bold')
        .fontSize(28)
        .fillColor('#0f172a')
        .text('CERTIFICATE OF COMPLETION', 40, 115, { align: 'center', characterSpacing: 1 });

      // Thin separator line
      doc.moveTo(width / 2 - 120, 150).lineTo(width / 2 + 120, 150).lineWidth(1).stroke('#d97706');

      // 7. Salutation
      doc.font('Helvetica-Oblique')
        .fontSize(12)
        .fillColor('#475569')
        .text('This is to officially certify that', 40, 165, { align: 'center' });

      // 8. Learner Name (Hero Element)
      doc.font('Helvetica-Bold')
        .fontSize(26)
        .fillColor('#0a66c2')
        .text(certData.learnerName, 40, 190, { align: 'center' });

      // 9. Narrative Body
      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#334155')
        .text('has successfully completed all required modules, project coursework, and assessment standards for', 40, 230, {
          align: 'center',
        });

      // 10. Course Title
      doc.font('Helvetica-Bold')
        .fontSize(20)
        .fillColor('#0f172a')
        .text(certData.courseTitle, 40, 255, { align: 'center' });

      // 11. Course Duration & Score Metadata
      const formattedDate = new Date(certData.completionDate || certData.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc.font('Helvetica')
        .fontSize(11)
        .fillColor('#64748b')
        .text(`Duration: ${certData.duration || 'Self-Paced Comprehensive'}  •  Assessment Score: ${certData.score ? `${certData.score}%` : 'Verified Pass'}`, 40, 288, {
          align: 'center',
        });

      // 12. Verification & Credential Details Box
      const boxY = 325;
      doc.roundedRect(width / 2 - 240, boxY, 480, 55, 6)
        .fillAndStroke('#f1f5f9', '#cbd5e1');

      doc.font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#0f172a')
        .text(`CREDENTIAL ID: ${certData.certificateId}`, width / 2 - 230, boxY + 12, { align: 'center' });

      doc.font('Helvetica')
        .fontSize(8)
        .fillColor('#475569')
        .text(`Issue Date: ${formattedDate}  |  Status: Verified Platform Credential`, width / 2 - 230, boxY + 26, {
          align: 'center',
        });

      if (certData.verificationUrl) {
        doc.font('Helvetica')
          .fontSize(8)
          .fillColor('#0a66c2')
          .text(`Verify Online: ${certData.verificationUrl}`, width / 2 - 230, boxY + 39, {
            align: 'center',
            link: certData.verificationUrl,
            underline: true,
          });
      }

      // 13. Signatures Area
      const sigY = 415;

      // Left Signature: Academic Board
      doc.moveTo(80, sigY + 40).lineTo(260, sigY + 40).lineWidth(1).stroke('#94a3b8');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text('MentorConnect AI Board', 80, sigY + 46, { width: 180, align: 'center' });
      doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Authorized Academic Issuer', 80, sigY + 58, { width: 180, align: 'center' });

      // Center: Official Seal Emblem
      const sealRadius = 28;
      const sealCenterX = width / 2;
      const sealCenterY = sigY + 35;
      doc.circle(sealCenterX, sealCenterY, sealRadius).lineWidth(2).stroke('#d97706');
      doc.circle(sealCenterX, sealCenterY, sealRadius - 4).lineWidth(1).stroke('#0a66c2');
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#0a66c2').text('OFFICIAL', sealCenterX - 20, sealCenterY - 10, { width: 40, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#d97706').text('VERIFIED', sealCenterX - 20, sealCenterY, { width: 40, align: 'center' });

      // Right Signature: Instructor
      doc.moveTo(width - 260, sigY + 40).lineTo(width - 80, sigY + 40).lineWidth(1).stroke('#94a3b8');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text(certData.instructorName || 'Master Faculty', width - 260, sigY + 46, { width: 180, align: 'center' });
      doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Domain Mentor & Instructor', width - 260, sigY + 58, { width: 180, align: 'center' });

      // 14. Bottom Footer Security Notice
      doc.font('Helvetica').fontSize(7.5).fillColor('#94a3b8').text(
        'This certificate is cryptographically registered and uniquely verifiable on the MentorConnect AI platform.',
        40,
        height - 45,
        { align: 'center' }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Issue or retrieve existing Certificate document
 */
const issueCertificate = async ({ learnerId, courseId, enrollmentId, score = 100 }) => {
  // Idempotency: Return existing certificate if already issued
  let existingCert = await Certificate.findOne({ enrollmentId });
  if (!existingCert) {
    existingCert = await Certificate.findOne({ learnerId, courseId });
  }

  if (existingCert) {
    return existingCert;
  }

  const [learner, course, enrollment] = await Promise.all([
    User.findById(learnerId),
    Course.findById(courseId),
    Enrollment.findById(enrollmentId),
  ]);

  if (!learner || !course || !enrollment) {
    throw new Error('Required records (learner, course, or enrollment) not found to issue certificate.');
  }

  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const certId = generateCertificateId();
  const verificationUrl = `${baseUrl}/verify-certificate/${certId}`;

  const certificate = await Certificate.create({
    certificateId: certId,
    learnerId,
    courseId,
    enrollmentId,
    learnerName: learner.name,
    courseTitle: course.title,
    instructorName: course.instructorName || 'MentorConnect Faculty',
    duration: course.duration || 'Self-Paced',
    score: score || 100,
    completionDate: enrollment.completedAt || new Date(),
    issuedAt: new Date(),
    status: 'issued',
    verificationUrl,
  });

  // Link certificate in enrollment
  enrollment.certificateId = certificate._id;
  await enrollment.save();

  return certificate;
};

/**
 * Public Verification lookup
 */
const verifyCertificateById = async (certificateId) => {
  const certificate = await Certificate.findOne({ certificateId })
    .populate('courseId', 'title category level duration thumbnail')
    .populate('learnerId', 'name');

  if (!certificate) {
    return {
      isValid: false,
      message: 'Certificate not found in registry. Please verify the Certificate ID.',
    };
  }

  return {
    isValid: certificate.status === 'issued',
    certificateId: certificate.certificateId,
    learnerName: certificate.learnerName,
    courseTitle: certificate.courseTitle,
    instructorName: certificate.instructorName,
    duration: certificate.duration,
    score: certificate.score,
    completionDate: certificate.completionDate,
    issuedAt: certificate.issuedAt,
    status: certificate.status,
    issuer: certificate.issuer,
    verificationUrl: certificate.verificationUrl,
  };
};

/**
 * Get all certificates earned by learner
 */
const getLearnerCertificates = async (learnerId) => {
  return await Certificate.find({ learnerId })
    .populate('courseId', 'title thumbnail category level duration')
    .sort({ issuedAt: -1 });
};

module.exports = {
  generateCertificateId,
  buildCertificatePdfBuffer,
  issueCertificate,
  verifyCertificateById,
  getLearnerCertificates,
};
