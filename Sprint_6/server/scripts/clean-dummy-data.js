const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mentorconnect';

async function cleanDummyData() {
  console.log('--- MentorConnect AI: Cleaning Dummy & Test Data ---');
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;

  // 1. Identify valid emails that should be preserved:
  const validEmails = [
    'admin@mentorconnect.ai',
    'alex.rivera@mentorconnect.ai',
    'marcus.vance@mentorconnect.ai',
    'sarah.jenkins@mentorconnect.ai',
    'waltermitty520@gmail.com',
    'learner@example.com',
    'n@gmail.com',
    'aswin@gmail.com',
  ];

  // Regex patterns of known dummy/test emails:
  const dummyEmailPattern = /sprint6test\.ai|test@|t@gmail\.com|test[0-9]@|sarah\.mentor@|alex\.mentor@|rahul\.learner\.new@|rahul\.learner@example\.com/i;

  const allUsers = await db.collection('users').find({}).toArray();
  const dummyUsers = allUsers.filter(u => {
    if (validEmails.includes(u.email.toLowerCase())) return false;
    if (dummyEmailPattern.test(u.email)) return true;
    if (u.name && u.name.toLowerCase().includes('test')) return true;
    return false;
  });

  const dummyUserIds = dummyUsers.map(u => u._id);
  console.log(`Found ${dummyUsers.length} dummy/test users to remove:`);
  dummyUsers.forEach(u => console.log(` - ${u.name} (${u.email}) [Role: ${u.role}]`));

  if (dummyUserIds.length > 0) {
    // 2. Delete profiles
    const delMentorProf = await db.collection('mentorprofiles').deleteMany({ userId: { $in: dummyUserIds } });
    console.log(`Deleted ${delMentorProf.deletedCount} dummy mentor profiles.`);

    const delLearnerProf = await db.collection('learnerprofiles').deleteMany({ userId: { $in: dummyUserIds } });
    console.log(`Deleted ${delLearnerProf.deletedCount} dummy learner profiles.`);

    // 3. Delete enrollments tied to dummy users
    const delEnrollments = await db.collection('enrollments').deleteMany({ learnerId: { $in: dummyUserIds } });
    console.log(`Deleted ${delEnrollments.deletedCount} dummy enrollments.`);

    // 4. Delete payment orders tied to dummy users
    const delPayments = await db.collection('paymentorders').deleteMany({ learnerId: { $in: dummyUserIds } });
    console.log(`Deleted ${delPayments.deletedCount} dummy payment orders.`);

    // 5. Delete certificates tied to dummy users
    const delCerts = await db.collection('certificates').deleteMany({ learnerId: { $in: dummyUserIds } });
    console.log(`Deleted ${delCerts.deletedCount} dummy certificates.`);

    // 6. Delete quiz results tied to dummy users
    const delQuizzes = await db.collection('quizresults').deleteMany({ userId: { $in: dummyUserIds } });
    console.log(`Deleted ${delQuizzes.deletedCount} dummy quiz results.`);

    // 7. Delete notifications tied to dummy users
    const delNotifs = await db.collection('notifications').deleteMany({ userId: { $in: dummyUserIds } });
    console.log(`Deleted ${delNotifs.deletedCount} dummy notifications.`);

    // 8. Delete sessions tied to dummy users
    const delSessions = await db.collection('sessions').deleteMany({
      $or: [
        { learnerId: { $in: dummyUserIds } },
        { mentorId: { $in: dummyUserIds } },
      ],
    });
    console.log(`Deleted ${delSessions.deletedCount} dummy sessions.`);

    // 9. Delete dummy email logs
    const delEmails = await db.collection('emaillogs').deleteMany({
      $or: [
        { recipientEmail: { $regex: /sprint6test\.ai|test@|t@gmail|test[0-9]@/i } },
        { recipientEmail: { $exists: false } },
        { recipientEmail: null },
      ],
    });
    console.log(`Deleted ${delEmails.deletedCount} dummy email logs.`);

    // 10. Delete the dummy users themselves
    const delUsersRes = await db.collection('users').deleteMany({ _id: { $in: dummyUserIds } });
    console.log(`Deleted ${delUsersRes.deletedCount} dummy users.`);
  }

  // Also clean up any orphan sessions with topic 'mock interview' or leftover duplicate test sessions
  const delOrphanSessions = await db.collection('sessions').deleteMany({
    $or: [
      { topic: 'mock interview' },
      { topic: 'mm' },
    ],
  });
  if (delOrphanSessions.deletedCount > 0) {
    console.log(`Deleted ${delOrphanSessions.deletedCount} dummy/test placeholder sessions.`);
  }

  // Also clean up any orphan certificates with recipientName undefined
  const delOrphanCerts = await db.collection('certificates').deleteMany({
    $or: [
      { recipientName: { $exists: false } },
      { recipientName: null },
      { recipientName: '' },
    ],
  });
  if (delOrphanCerts.deletedCount > 0) {
    console.log(`Deleted ${delOrphanCerts.deletedCount} orphan certificates.`);
  }

  // Recalculate course enrolledCount based on remaining valid enrollments
  const courses = await db.collection('courses').find({}).toArray();
  for (const c of courses) {
    const validCount = await db.collection('enrollments').countDocuments({ courseId: c._id });
    await db.collection('courses').updateOne({ _id: c._id }, { $set: { enrolledCount: validCount } });
    console.log(`Updated course "${c.title}" enrolledCount to ${validCount}.`);
  }

  console.log('--- Cleanup Finished Successfully ---');
  process.exit(0);
}

cleanDummyData().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
