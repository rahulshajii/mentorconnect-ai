const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const quizRoutes = require('./routes/quizRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser with 50mb limit for profile image uploads & CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({
    project: 'MentorConnect AI — AMIE Core API Engine',
    sprint: 'Sprint 3 — Mentor Discovery, Profile, Booking & Notifications',
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
    ],
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  await connectDB();

  const server = app.listen(PORT, 'localhost', () => {
    console.log(`=================================================`);
    console.log(` MentorConnect AI Backend running on port ${PORT}`);
    console.log(` API Base Endpoint: http://localhost:${PORT}/api`);
    console.log(`=================================================`);
  });

  server.on('error', (err) => {
    console.warn(`Server Notice: ${err.message}`);
  });
}

startServer();
