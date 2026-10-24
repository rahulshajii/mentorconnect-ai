const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

function makeBufferRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ status: res.statusCode, headers: res.headers, buffer });
      });
    });
    req.on('error', (err) => reject(err));
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('  MentorConnect AI — Full-Stack Verification Suite');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // Spin up ephemeral test server from the actual Express app
  const app = require('./index.js');
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      console.log(`Ephemeral Test Server started on port ${port}`);
      resolve(port);
    });
  });

  const port = server.address().port;
  const host = '127.0.0.1';

  try {
    // -------------------------------------------------------------
    // SUITE 1: API ROOT & HEALTH
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: API Root & Health ---');
    const rootRes = await makeRequest({ hostname: host, port, path: '/', method: 'GET' });
    assert(rootRes.status === 200, 'GET / returns HTTP 200');
    assert(rootRes.body.project.includes('MentorConnect AI'), 'Root response contains MentorConnect project name');
    assert(rootRes.body.release.includes('Production'), 'Root response confirms Production Release');

    // -------------------------------------------------------------
    // SUITE 2: AUTHENTICATION & ACCESS CONTROL
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: Authentication & Access Control ---');
    const timestamp = Date.now();
    const learnerEmail = `learner.${timestamp}@mentorconnect-test.ai`;
    const mentorEmail = `mentor.${timestamp}@mentorconnect-test.ai`;

    // 2.1 Register Learner
    const regLearner = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Test Learner',
        email: learnerEmail,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'learner',
        education: 'B.Tech Information Technology',
        careerGoal: 'Full-Stack Engineer',
        skills: ['React', 'Node.js'],
      }
    );
    assert(regLearner.status === 201, 'Learner registered successfully (HTTP 201)');
    assert(Boolean(regLearner.body.token), 'JWT token returned on registration');
    const learnerToken = regLearner.body.token;
    const learnerId = regLearner.body.user._id;

    // 2.2 Register Mentor
    const regMentor = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Test Mentor',
        email: mentorEmail,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'mentor',
        experience: 7,
        expertise: ['React', 'System Architecture'],
        hourlyFee: 75,
      }
    );
    assert(regMentor.status === 201, 'Mentor registered successfully (HTTP 201)');
    const mentorToken = regMentor.body.token;
    const mentorId = regMentor.body.user._id;

    // 2.3 Login Learner
    const loginLearner = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: learnerEmail, password: 'password123' }
    );
    assert(loginLearner.status === 200, 'Learner login verified (HTTP 200)');
    assert(loginLearner.body.user.email === learnerEmail.toLowerCase(), 'Login user profile returned');

    // 2.4 Reject Unauthorized Access
    const unauthRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/courses/my',
      method: 'GET',
    });
    assert(unauthRes.status === 401, 'Protected route rejects request without token (HTTP 401)');

    const badTokenRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/courses/my',
      method: 'GET',
      headers: { Authorization: 'Bearer bad_invalid_token_12345' },
    });
    assert(badTokenRes.status === 401, 'Protected route rejects invalid token (HTTP 401)');

    // -------------------------------------------------------------
    // SUITE 3: COURSE CATALOG & ENROLLMENT
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: Course Catalog & Enrollment ---');

    // 3.1 List Courses
    const coursesRes = await makeRequest({ hostname: host, port, path: '/api/courses', method: 'GET' });
    assert(coursesRes.status === 200, 'GET /api/courses returns HTTP 200');
    assert(coursesRes.body.courses && coursesRes.body.courses.length >= 5, 'Sample technical courses seeded & retrieved');

    const samplePaidCourse = coursesRes.body.courses.find((c) => c.price > 0);
    const sampleFreeCourse = coursesRes.body.courses.find((c) => c.price === 0);
    assert(Boolean(samplePaidCourse), 'Paid course found in catalog (price > 0)');
    assert(Boolean(sampleFreeCourse), 'Free course found in catalog (price === 0)');

    // 3.2 Category & Price Filtering
    const webDevRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/courses?category=Web%20Development',
      method: 'GET',
    });
    assert(webDevRes.status === 200, 'Category filter returns HTTP 200');
    assert(
      webDevRes.body.courses.every((c) => c.category === 'Web Development'),
      'All returned courses match requested category'
    );

    const freeCoursesRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/courses?price=Free',
      method: 'GET',
    });
    assert(
      freeCoursesRes.body.courses.every((c) => c.price === 0),
      'Price filter "Free" returns only free courses'
    );

    // 3.3 Free Course Enrollment
    const freeEnrollRes = await makeRequest(
      {
        hostname: host,
        port,
        path: `/api/courses/${sampleFreeCourse._id}/enroll`,
        method: 'POST',
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(freeEnrollRes.status === 200, 'Free course enrollment succeeded (HTTP 200)');
    assert(freeEnrollRes.body.enrollment.paymentStatus === 'free', 'Free course enrollment status recorded as "free"');
    assert(freeEnrollRes.body.enrollment.progress === 0, 'Initial progress is 0%');

    // 3.4 Prevent Duplicate Free Enrollment
    const dupFreeEnrollRes = await makeRequest(
      {
        hostname: host,
        port,
        path: `/api/courses/${sampleFreeCourse._id}/enroll`,
        method: 'POST',
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(dupFreeEnrollRes.status === 200, 'Duplicate enrollment call returns HTTP 200');
    assert(dupFreeEnrollRes.body.isAlreadyEnrolled === true, 'Duplicate enrollment prevented & recognized');

    // -------------------------------------------------------------
    // SUITE 4: DEMO PAYMENT SIMULATION & TRANSACTION RECORDS
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: Demo Payment Simulation & Verification ---');

    // 4.1 Paid Course Enrollment Initiation
    const paidEnrollAttempt = await makeRequest(
      {
        hostname: host,
        port,
        path: `/api/courses/${samplePaidCourse._id}/enroll`,
        method: 'POST',
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(paidEnrollAttempt.status === 200, 'Paid enrollment attempt handled gracefully');
    assert(paidEnrollAttempt.body.requiresPayment === true, 'Server enforces payment requirement for paid course');

    // 4.2 Create Demo Order (Server Price Lookup)
    const createOrderRes = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/payments/demo/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      { courseId: samplePaidCourse._id, fakeBrowserPrice: 1 } // fake price must be ignored by server!
    );
    assert(createOrderRes.status === 201, 'Demo order created successfully (HTTP 201)');
    assert(createOrderRes.body.amount === samplePaidCourse.price, 'Order amount strictly derived from database price');
    assert(Boolean(createOrderRes.body.orderId), 'Unique orderId generated (e.g., ORD-2026-XXXX)');
    const orderId = createOrderRes.body.orderId;

    // 4.3 Confirm Demo Payment
    const confirmPaymentRes = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/payments/demo/confirm',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      { orderId }
    );
    assert(confirmPaymentRes.status === 200, 'Demo payment confirmation succeeded (HTTP 200)');
    assert(confirmPaymentRes.body.success === true, 'Payment confirmation marked success');
    assert(confirmPaymentRes.body.transactionReference.startsWith('TXN-DEMO-'), 'Simulated transaction ref generated');

    // 4.4 Idempotency Check: Repeated Confirmation must NOT duplicate transaction
    const repeatConfirmRes = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/payments/demo/confirm',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      { orderId }
    );
    assert(repeatConfirmRes.status === 200, 'Repeat confirmation returns HTTP 200');
    assert(repeatConfirmRes.body.isDuplicateConfirmation === true, 'Repeat confirmation recognized as idempotent duplicate');
    assert(
      repeatConfirmRes.body.transactionReference === confirmPaymentRes.body.transactionReference,
      'Same transaction reference preserved without recreation'
    );

    // 4.5 Verify Paid Access Granted in Learner Courses
    const myCoursesRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/courses/my',
      method: 'GET',
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(myCoursesRes.status === 200, 'GET /api/courses/my returns HTTP 200');
    const paidEnrollment = myCoursesRes.body.find((e) => (e.courseId?._id || e.courseId) === samplePaidCourse._id);
    assert(Boolean(paidEnrollment), 'Paid course now present in learner enrolled courses');
    assert(paidEnrollment.paymentStatus === 'paid', 'Enrollment paymentStatus is "paid"');

    // -------------------------------------------------------------
    // SUITE 5: COURSE PROGRESS & SERVER-ENFORCED COMPLETION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 5: Course Progress & Server-Enforced Completion ---');

    const courseLessons = samplePaidCourse.curriculum;
    assert(courseLessons && courseLessons.length > 0, 'Course has structured curriculum lessons');

    // 5.1 Reject Premature Completion when lessons are incomplete
    const prematureComplete = await makeRequest(
      {
        hostname: host,
        port,
        path: `/api/courses/${samplePaidCourse._id}/complete`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      {}
    );
    assert(prematureComplete.status === 400 || prematureComplete.status === 500, 'Premature completion rejected by server');

    // 5.2 Record Lesson Progress sequentially
    for (let i = 0; i < courseLessons.length; i++) {
      const lesson = courseLessons[i];
      const progRes = await makeRequest(
        {
          hostname: host,
          port,
          path: `/api/courses/${samplePaidCourse._id}/lessons/${lesson.lessonId}/progress`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${learnerToken}`,
          },
        },
        { isCompleted: true }
      );
      assert(progRes.status === 200, `Lesson ${i + 1}/${courseLessons.length} marked complete (HTTP 200)`);
    }

    // 5.3 Complete Course with Assessment
    const assessmentAnswers = {};
    if (samplePaidCourse.assessment) {
      samplePaidCourse.assessment.forEach((q) => {
        assessmentAnswers[q.questionId] = q.correctAnswer;
      });
    }

    const verifiedCompleteRes = await makeRequest(
      {
        hostname: host,
        port,
        path: `/api/courses/${samplePaidCourse._id}/complete`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      { assessmentAnswers }
    );
    assert(verifiedCompleteRes.status === 200, 'Verified course completion accepted by backend (HTTP 200)');
    assert(verifiedCompleteRes.body.status === 'completed', 'Enrollment status updated to "completed"');
    assert(verifiedCompleteRes.body.progress === 100, 'Course progress verified at 100%');
    assert(Boolean(verifiedCompleteRes.body.certificateId), 'Certificate minted on course completion');
    const mintedCertId = verifiedCompleteRes.body.certificateId;

    // -------------------------------------------------------------
    // SUITE 6: CERTIFICATE GENERATION & PUBLIC VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 6: Certificate Generation & Public Verification ---');

    // 6.1 Learner Certificate Listing
    const myCertsRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/certificates/my',
      method: 'GET',
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(myCertsRes.status === 200, 'GET /api/certificates/my returns HTTP 200');
    assert(myCertsRes.body.some((c) => c.certificateId === mintedCertId), 'Minted certificate listed in learner portfolio');

    // 6.2 Public Verification Lookup
    const verifyRes = await makeRequest({
      hostname: host,
      port,
      path: `/api/certificates/verify/${mintedCertId}`,
      method: 'GET',
    });
    assert(verifyRes.status === 200, 'Public certificate verification returns HTTP 200');
    assert(verifyRes.body.isValid === true, 'Certificate confirmed valid and authentic');
    assert(verifyRes.body.learnerName === 'Test Learner', 'Learner name verified');
    assert(verifyRes.body.courseTitle === samplePaidCourse.title, 'Course title verified');

    // 6.3 Reject Invalid Certificate Lookup
    const invalidCertRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/certificates/verify/MC-CERT-FAKE-99999',
      method: 'GET',
    });
    assert(invalidCertRes.status === 404, 'Nonexistent certificate returns HTTP 404');
    assert(invalidCertRes.body.isValid === false, 'Nonexistent certificate identified as invalid');

    // 6.4 Download Certificate PDF (Verify binary stream & magic bytes)
    const pdfRes = await makeBufferRequest({
      hostname: host,
      port,
      path: `/api/certificates/${mintedCertId}/download`,
      method: 'GET',
    });
    assert(pdfRes.status === 200, 'Certificate PDF download returns HTTP 200');
    assert(pdfRes.headers['content-type'] === 'application/pdf', 'Response Content-Type is application/pdf');
    assert(pdfRes.buffer && pdfRes.buffer.length > 500, 'PDF buffer size is non-empty (>500 bytes)');
    const pdfHeader = pdfRes.buffer.slice(0, 5).toString('ascii');
    assert(pdfHeader.startsWith('%PDF'), 'Downloaded file starts with %PDF magic bytes');

    // -------------------------------------------------------------
    // SUITE 7: AUTOMATIC EMAIL LOGGING & DEV FALLBACK
    // -------------------------------------------------------------
    console.log('\n--- SUITE 7: Automatic Email System & Logging ---');

    const emailStatusRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/email/status',
      method: 'GET',
    });
    assert(emailStatusRes.status === 200, 'GET /api/email/status returns HTTP 200');
    assert(emailStatusRes.body.mode.includes('Simulated') || emailStatusRes.body.mode.includes('Live'), 'Email operational mode documented');
    assert(emailStatusRes.body.totalLogs > 0, 'Email events recorded in database');

    const EmailLog = require('./models/EmailLog');
    const paymentReceiptLog = await EmailLog.findOne({
      recipient: learnerEmail.toLowerCase(),
      eventType: 'payment_receipt',
    });
    assert(Boolean(paymentReceiptLog), 'Payment receipt email event logged for learner');

    const completionEmailLog = await EmailLog.findOne({
      recipient: learnerEmail.toLowerCase(),
      eventType: 'course_completion',
    });
    assert(Boolean(completionEmailLog), 'Course completion email event logged for learner');

    const paymentCompletionLog = await EmailLog.findOne({
      recipient: learnerEmail.toLowerCase(),
      eventType: 'payment_completion',
    });
    assert(Boolean(paymentCompletionLog), 'Payment completion settlement email event logged for learner');

    // -------------------------------------------------------------
    // SUITE 8: REGRESSION OF CORE MENTORING & AMIE FEATURES
    // -------------------------------------------------------------
    console.log('\n--- SUITE 8: Regression of Core Mentoring & AMIE Features ---');

    // 8.1 Learner Profile Update & Fetch
    const profGet = await makeRequest({
      hostname: host,
      port,
      path: '/api/profile',
      method: 'GET',
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(profGet.status === 200, 'GET /api/profile returns HTTP 200');

    // 8.2 Skill Assessment Quiz (AMIE Diagnostic Quiz)
    const quizStart = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/quiz/start',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      { skill: 'React' }
    );
    assert(quizStart.status === 200, 'POST /api/quiz/start returns HTTP 200');
    assert(quizStart.body.questions && quizStart.body.questions.length > 0, 'Quiz questions returned');

    const quizSubmit = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/quiz/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      {
        skill: 'React',
        answers: {
          q_react_1: ['useEffect'],
          q_react_2: ['To prevent re-rendering when props have not changed'],
        },
      }
    );
    assert(quizSubmit.status === 200, 'POST /api/quiz/submit returns HTTP 200');
    assert(quizSubmit.body.result && quizSubmit.body.result.percentage >= 60, 'Quiz score graded');

    // 8.3 Skill Gap Analysis (Readiness Diagnostics)
    const skillGapRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/skill-gap',
      method: 'GET',
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(skillGapRes.status === 200, 'GET /api/skill-gap returns HTTP 200');
    assert(typeof skillGapRes.body.readinessPercentage === 'number', 'Readiness percentage calculated');

    // 8.4 AMIE Mentor Recommendations (Explainable Mentor Matching)
    const amieRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/recommendations',
      method: 'GET',
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(amieRes.status === 200, 'GET /api/recommendations returns HTTP 200');
    assert(amieRes.body.recommendations && amieRes.body.recommendations.length > 0, 'AMIE recommendations returned');
    assert(
      typeof amieRes.body.recommendations[0].matchScore === 'number',
      'AMIE calculated explainable match score'
    );

    // 8.5 Mentoring Session Booking (Session Scheduling)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];

    const bookSessionRes = await makeRequest(
      {
        hostname: host,
        port,
        path: '/api/sessions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${learnerToken}`,
        },
      },
      {
        mentorId: mentorId,
        date: dateStr,
        startTime: '10:00 AM',
        topic: 'System Design Scaling Architecture',
        description: 'Need mentoring on Redis caching and sharding.',
      }
    );
    assert(bookSessionRes.status === 201, 'POST /api/sessions creates session (HTTP 201)');
    assert(bookSessionRes.body.session.status === 'pending', 'Session created in pending status');
    assert(Boolean(bookSessionRes.body.session.meetingLink), 'Session meetingLink generated');

    // 8.6 In-App Notifications
    const notifsRes = await makeRequest({
      hostname: host,
      port,
      path: '/api/notifications',
      method: 'GET',
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(notifsRes.status === 200, 'GET /api/notifications returns HTTP 200');
    assert(notifsRes.body.notifications && notifsRes.body.notifications.length > 0, 'Notifications delivered to learner');

    // -------------------------------------------------------------
    // AUTOMATED TEST DATA CLEANUP (Keeps Production Database Clean)
    // -------------------------------------------------------------
    try {
      const db = mongoose.connection.db;
      if (db) {
        const testUsers = await db.collection('users').find({ email: { $in: [learnerEmail, mentorEmail] } }).toArray();
        const testIds = testUsers.map((u) => u._id);
        if (testIds.length > 0) {
          await db.collection('mentorprofiles').deleteMany({ userId: { $in: testIds } });
          await db.collection('learnerprofiles').deleteMany({ userId: { $in: testIds } });
          await db.collection('enrollments').deleteMany({ learnerId: { $in: testIds } });
          await db.collection('paymentorders').deleteMany({ learnerId: { $in: testIds } });
          await db.collection('certificates').deleteMany({ learnerId: { $in: testIds } });
          await db.collection('quizresults').deleteMany({ userId: { $in: testIds } });
          await db.collection('notifications').deleteMany({ userId: { $in: testIds } });
          await db.collection('sessions').deleteMany({ $or: [{ learnerId: { $in: testIds } }, { mentorId: { $in: testIds } }] });
          await db.collection('emaillogs').deleteMany({ recipient: { $in: [learnerEmail.toLowerCase(), mentorEmail.toLowerCase()] } });
          await db.collection('users').deleteMany({ _id: { $in: testIds } });
          console.log('🧹 Cleaned up temporary test suite users & artifacts from MongoDB.');
        }
      }
    } catch (cleanErr) {
      console.warn('Note: Non-critical test cleanup notice:', cleanErr.message);
    }

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log(` 🎉 ALL ${passedTests}/${totalTests} TESTS PASSED CLEANLY (100% SUCCESS RATE)!`);
    console.log('================================================================\n');

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test execution failed with error:', err.message);
    server.close();
    process.exit(1);
  }
}

runTests();
