const bcrypt = require('bcryptjs');
const User = require('../models/User');
const LearnerProfile = require('../models/LearnerProfile');
const MentorProfile = require('../models/MentorProfile');
const generateToken = require('../utils/generateToken');

const registerUser = async (userData) => {
  const {
    name,
    email,
    password,
    role,
    education,
    careerGoal,
    skills,
    experience,
    expertise,
    sessionPrice,
    hourlyFee,
    availability,
    bio,
  } = userData;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists with this email address');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role === 'mentor' ? 'mentor' : 'learner',
  });

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  let profileData = {};

  if (user.role === 'learner') {
    let structuredSkills = [];
    if (Array.isArray(skills)) {
      structuredSkills = skills.map((s) =>
        typeof s === 'string' ? { name: s, level: 'Intermediate' } : s
      );
    } else if (typeof skills === 'string' && skills.trim()) {
      structuredSkills = skills.split(',').map((s) => ({ name: s.trim(), level: 'Intermediate' }));
    }

    const learnerProfile = await LearnerProfile.create({
      userId: user._id,
      education: education || '',
      careerGoal: careerGoal || '',
      skills: structuredSkills,
      bio: bio || 'Enthusiastic learner dedicated to continuous skill acquisition.',
      profileImage: defaultAvatar,
    });
    profileData = learnerProfile;
  } else {
    let structuredExpertise = [];
    if (Array.isArray(expertise)) {
      structuredExpertise = expertise.map((e) =>
        typeof e === 'string' ? { name: e, experience: Number(experience) || 3 } : e
      );
    } else if (typeof expertise === 'string' && expertise.trim()) {
      structuredExpertise = expertise.split(',').map((e) => ({
        name: e.trim(),
        experience: Number(experience) || 3,
      }));
    }

    const price = Number(sessionPrice) || Number(hourlyFee) || 50;

    const mentorProfile = await MentorProfile.create({
      userId: user._id,
      experience: Number(experience) || 3,
      expertise: structuredExpertise,
      sessionPrice: price,
      availability: Array.isArray(availability)
        ? availability
        : (availability ? [availability] : ['Mon-Fri: 10:00 AM - 04:00 PM']),
      rating: 5.0,
      bio: bio || 'Senior professional passionate about mentoring talent.',
      profileImage: defaultAvatar,
    });
    profileData = mentorProfile;
  }

  const token = generateToken(user._id, user.role);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
    profile: profileData,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  let profile = null;
  if (user.role === 'learner') {
    profile = await LearnerProfile.findOne({ userId: user._id });
  } else {
    profile = await MentorProfile.findOne({ userId: user._id });
  }

  const token = generateToken(user._id, user.role);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
    profile,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
