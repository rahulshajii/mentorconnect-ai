const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const LearnerProfile = require('./models/LearnerProfile');
const MentorProfile = require('./models/MentorProfile');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser & CORS
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mentors', mentorRoutes);

app.get('/', (req, res) => {
  res.json({
    project: 'MentorConnect AI - AMIE Backend API',
    sprint: 'Sprint 1 - Auth & Profiles',
    status: 'Active',
    endpoints: ['/api/auth/register', '/api/auth/login', '/api/profile', '/api/mentors'],
  });
});

// Global Error Handler
app.use(errorHandler);

// Seed initial sample accounts if DB is empty
async function seedInitialData() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial Mentor and Learner demo accounts...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Mentor 1
      const mentorUser1 = await User.create({
        name: 'Sarah Jenkins',
        email: 'sarah.mentor@example.com',
        password: hashedPassword,
        role: 'mentor',
      });
      await MentorProfile.create({
        userId: mentorUser1._id,
        experience: 8,
        expertise: ['React', 'Node.js', 'System Architecture', 'AI Engineering'],
        hourlyFee: 75,
        availability: ['Mon 10am-2pm', 'Wed 2pm-6pm', 'Fri 1pm-4pm'],
        rating: 4.9,
        bio: 'Senior Full Stack Tech Lead with 8+ years mentoring developers.',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      });

      // Mentor 2
      const mentorUser2 = await User.create({
        name: 'Dr. Alex Rivera',
        email: 'alex.mentor@example.com',
        password: hashedPassword,
        role: 'mentor',
      });
      await MentorProfile.create({
        userId: mentorUser2._id,
        experience: 10,
        expertise: ['Python', 'FastAPI', 'Machine Learning', 'RAG & Vector DBs'],
        hourlyFee: 90,
        availability: ['Tue 10am-1pm', 'Thu 2pm-5pm'],
        rating: 5.0,
        bio: 'AI Staff Researcher & Mentor specializing in Intelligent Agents.',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      });

      // Learner 1
      const learnerUser1 = await User.create({
        name: 'Rahul Shaji',
        email: 'rahul.learner@example.com',
        password: hashedPassword,
        role: 'learner',
      });
      await LearnerProfile.create({
        userId: learnerUser1._id,
        education: 'Master of Computer Applications (MCA)',
        careerGoal: 'AI Engineer & Full-Stack Architect',
        skills: ['JavaScript', 'Python', 'React', 'MongoDB'],
        bio: 'Dedicated learner passionate about AI & full-stack Web Apps.',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      });

      console.log('Sample demo accounts seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

// Start Server
async function startServer() {
  await connectDB();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` MentorConnect AI Backend running on port ${PORT}`);
    console.log(` API Endpoint: http://localhost:${PORT}/api/auth`);
    console.log(`=================================================`);
  });
}

startServer();
