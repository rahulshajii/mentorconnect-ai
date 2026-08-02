const User = require('../models/User');
const LearnerProfile = require('../models/LearnerProfile');
const MentorProfile = require('../models/MentorProfile');

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  let profile = null;
  if (user.role === 'learner') {
    profile = await LearnerProfile.findOne({ userId: user._id });
  } else {
    profile = await MentorProfile.findOne({ userId: user._id });
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    profile,
  };
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (updateData.name) {
    user.name = updateData.name;
    await user.save();
  }

  let profile = null;
  if (user.role === 'learner') {
    profile = await LearnerProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = new LearnerProfile({ userId: user._id });
    }

    if (updateData.education !== undefined) profile.education = updateData.education;
    if (updateData.careerGoal !== undefined) profile.careerGoal = updateData.careerGoal;
    if (updateData.bio !== undefined) profile.bio = updateData.bio;
    if (updateData.profileImage !== undefined || updateData.profilePicture !== undefined) {
      profile.profileImage = updateData.profileImage || updateData.profilePicture;
    }
    if (updateData.coverPicture !== undefined) profile.coverPicture = updateData.coverPicture;

    if (updateData.skills !== undefined) {
      if (Array.isArray(updateData.skills)) {
        profile.skills = updateData.skills.map((s) =>
          typeof s === 'string' ? { name: s, level: 'Intermediate' } : s
        );
      } else if (typeof updateData.skills === 'string') {
        profile.skills = updateData.skills.split(',').map((s) => ({
          name: s.trim(),
          level: 'Intermediate',
        })).filter((s) => s.name);
      }
    }

    await profile.save();
  } else {
    profile = await MentorProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = new MentorProfile({ userId: user._id });
    }

    if (updateData.experience !== undefined) profile.experience = Number(updateData.experience);
    if (updateData.sessionPrice !== undefined || updateData.hourlyFee !== undefined) {
      profile.sessionPrice = Number(updateData.sessionPrice || updateData.hourlyFee);
    }
    if (updateData.bio !== undefined) profile.bio = updateData.bio;
    if (updateData.profileImage !== undefined || updateData.profilePicture !== undefined) {
      profile.profileImage = updateData.profileImage || updateData.profilePicture;
    }
    if (updateData.coverPicture !== undefined) profile.coverPicture = updateData.coverPicture;

    if (updateData.availability !== undefined) {
      profile.availability = Array.isArray(updateData.availability)
        ? updateData.availability
        : updateData.availability.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (updateData.expertise !== undefined) {
      if (Array.isArray(updateData.expertise)) {
        profile.expertise = updateData.expertise.map((e) =>
          typeof e === 'string' ? { name: e, experience: profile.experience || 3 } : e
        );
      } else if (typeof updateData.expertise === 'string') {
        profile.expertise = updateData.expertise.split(',').map((e) => ({
          name: e.trim(),
          experience: profile.experience || 3,
        })).filter((e) => e.name);
      }
    }

    await profile.save();
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile,
  };
};

const getMentorsList = async () => {
  const mentors = await MentorProfile.find().populate('userId', 'name email role');
  return mentors;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getMentorsList,
};
