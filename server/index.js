const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const quizRoutes = require('./routes/quizRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const emailRoutes = require('./routes/emailRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { seedDatabase } = require('./seeds/seedData');

const app = express();
const PORT = process.env.PORT || 5001;

// Body parser with 50mb limit for profile image uploads & CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Core Mentoring & AMIE Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/amie/recommendations', recommendationRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/notifications', notificationRoutes);

// Course, Payment, Certificate, Email & Admin Modules
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/admin', adminRoutes);

const User = require('./models/User');
const Course = require('./models/Course');
const Session = require('./models/Session');
const MentorProfile = require('./models/MentorProfile');

// Public Platform Statistics Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const activeLearners = await User.countDocuments({ role: 'learner' });
    const verifiedMentors = await User.countDocuments({ role: 'mentor' });
    const totalCourses = await Course.countDocuments({ published: true });
    const totalSessions = await Session.countDocuments();

    const mentors = await MentorProfile.find({}, 'rating');
    let avgRating = 4.9;
    if (mentors.length > 0) {
      const sum = mentors.reduce((acc, m) => acc + (m.rating || 5.0), 0);
      avgRating = Number((sum / mentors.length).toFixed(1));
    }

    res.json({
      activeLearners,
      verifiedMentors,
      totalCourses,
      totalSessions,
      satisfactionRate: '98%',
      averageRating: avgRating,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving platform stats' });
  }
});

app.get('/', (req, res) => {
  res.json({
    project: 'MentorConnect AI — AMIE Core API Engine',
    version: '1.0.0',
    release: 'Production Release',
    status: 'Active',
    endpoints: [
      '/api/auth',
      '/api/profile',
      '/api/mentors',
      '/api/quiz',
      '/api/recommendations',
      '/api/skill-gap',
      '/api/sessions',
      '/api/notifications',
      '/api/courses',
      '/api/payments',
      '/api/certificates',
      '/api/email',
      '/api/admin',
    ],
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  await connectDB();
  await seedDatabase();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(` MentorConnect AI Backend running on port ${PORT}`);
    console.log(` API Base Endpoint: http://localhost:${PORT}/api`);
    console.log(` Architecture: MentorConnect AI Production`);
    console.log(`=================================================`);
  });

  server.on('error', (err) => {
    console.warn(`Server Notice: ${err.message}`);
  });
}

startServer();

module.exports = app;
