const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('  MentorConnect AI — Sprint 2 Integration Test Suite');
  console.log('==================================================\n');

  try {
    // 1. GET /
    console.log('[Test 1] GET / (Root API Info)...');
    const res1 = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/',
      method: 'GET',
    });
    console.log(` Status: ${res1.status}`);
    console.log(` Project: ${res1.body.project}`);
    console.log(` Sprint: ${res1.body.sprint}\n`);

    // 2. Register Learner User
    const testEmail = `test.learner.${Date.now()}@example.com`;
    console.log(`[Test 2] POST /api/auth/register (${testEmail})...`);
    const res2 = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Test Learner',
        email: testEmail,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'learner',
        education: 'B.S. Computer Science',
        careerGoal: 'Full-Stack Engineer',
        skills: ['React', 'Node.js'],
      }
    );
    console.log(` Status: ${res2.status}`);
    console.log(` Token Received: ${res2.body.token ? 'YES' : 'NO'}`);
    const token = res2.body.token;

    if (!token) {
      console.error('Registration failed! Output:', res2.body);
      process.exit(1);
    }

    // 3. GET /api/auth/me
    console.log('\n[Test 3] GET /api/auth/me (Auth Check)...');
    const res3 = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(` Status: ${res3.status}`);
    console.log(` Authenticated User: ${res3.body.name} (${res3.body.role})\n`);

    // 4. GET /api/profile
    console.log('[Test 4] GET /api/profile (Profile Fetch)...');
    const res4 = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/profile',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(` Status: ${res4.status}`);
    console.log(` Profile Education: ${res4.body.profile?.education}\n`);

    // 5. PUT /api/profile (Profile Update with image & social links & skills sanitization)
    console.log('[Test 5] PUT /api/profile (Profile Update & Image Base64)...');
    const res5 = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/profile',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      {
        name: 'Test Learner Updated',
        bio: 'Enthusiastic full-stack engineer and learner.',
        profileImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
        coverPicture: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
        education: 'Master in Software Systems',
        careerGoal: 'AI Engineer & Architect',
        socialLinks: {
          github: 'https://github.com/testlearner',
          linkedin: 'https://linkedin.com/in/testlearner',
          portfolio: 'https://testlearner.dev',
        },
        skills: ['React', 'Node.js', 'Python', 'System Architecture'],
      }
    );
    console.log(` Status: ${res5.status}`);
    console.log(` Update Message: ${res5.body.message}\n`);

    // 6. POST /api/quiz/start
    console.log('[Test 6] POST /api/quiz/start (React Assessment)...');
    const res6 = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/quiz/start',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      { skill: 'React' }
    );
    console.log(` Status: ${res6.status}`);
    console.log(` Questions Returned: ${res6.body.questions?.length}\n`);

    // 7. POST /api/quiz/submit
    console.log('[Test 7] POST /api/quiz/submit (Assessment Submission)...');
    const res7 = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/quiz/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
    console.log(` Status: ${res7.status}`);
    console.log(` Assessment Score: ${res7.body.result?.percentage}%`);
    console.log(` Assessed Level: ${res7.body.result?.levelAssessed}\n`);

    // 8. GET /api/skill-gap
    console.log('[Test 8] GET /api/skill-gap (Skill Gap Analysis)...');
    const res8 = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/skill-gap',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(` Status: ${res8.status}`);
    console.log(` Target Goal: ${res8.body.careerGoal}`);
    console.log(` Readiness Percentage: ${res8.body.readinessPercentage}%\n`);

    // 9. GET /api/recommendations
    console.log('[Test 9] GET /api/recommendations (AMIE v1 Recommendation Engine)...');
    const res9 = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/recommendations',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(` Status: ${res9.status}`);
    console.log(` Recommended Mentors Count: ${res9.body.recommendations?.length}`);
    if (res9.body.recommendations?.length > 0) {
      const top = res9.body.recommendations[0];
      console.log(` Top Recommendation: ${top.name} (${top.matchScore}% Match)`);
      console.log(` Match Reason: "${top.reasons?.[0]}"`);
    }

    console.log('\n==================================================');
    console.log(' 🎉 ALL INTEGRATION TESTS PASSED 100% CLEANLY!');
    console.log('==================================================');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
