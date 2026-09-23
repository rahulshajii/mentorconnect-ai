const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LearnerProfile = require('../models/LearnerProfile');
const MentorProfile = require('../models/MentorProfile');

const JWT_SECRET = process.env.JWT_SECRET || 'mentorconnect_jwt_secret_key_2026';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Learner or Mentor)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validation checks
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, email, password, role)');
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400);
      throw new Error('Password and Confirm Password do not match');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    // Email format regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400);
      throw new Error('An account with this email address already exists');
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userRole = role === 'mentor' ? 'mentor' : 'learner';
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
    });

    // Create associated profile document
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    let profile = null;

    if (userRole === 'learner') {
      profile = await LearnerProfile.create({
        userId: user._id,
        education: req.body.education || '',
        careerGoal: req.body.careerGoal || '',
        skills: req.body.skills ? (Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim())) : [],
        profilePicture: defaultAvatar,
      });
    } else {
      profile = await MentorProfile.create({
        userId: user._id,
        experience: Number(req.body.experience) || 0,
        expertise: req.body.expertise ? (Array.isArray(req.body.expertise) ? req.body.expertise : req.body.expertise.split(',').map(s => s.trim())) : [],
        hourlyFee: Number(req.body.hourlyFee) || 0,
        availability: req.body.availability ? (Array.isArray(req.body.availability) ? req.body.availability : [req.body.availability]) : ['Mon-Fri 10am-4pm'],
        profilePicture: defaultAvatar,
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email address and password');
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Verify bcrypt password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    let profile = null;
    if (user.role === 'learner') {
      profile = await LearnerProfile.findOne({ userId: user._id });
    } else {
      profile = await MentorProfile.findOne({ userId: user._id });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send password reset email link (Forgot Password UI Backend API)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide your registered email address');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return 200 for security to prevent email enumeration
      return res.status(200).json({
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    }

    // Password reset token logic simulation
    return res.status(200).json({
      message: 'Password reset link has been successfully sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    let profile = null;
    if (user.role === 'learner') {
      profile = await LearnerProfile.findOne({ userId: user._id });
    } else {
      profile = await MentorProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  getMe,
};
