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

// Helper function to sanitize skills array
const sanitizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s) => {
      if (typeof s === 'string') {
        return { name: s.trim(), level: 'Intermediate' };
      }
      if (s && typeof s === 'object') {
        const nameVal = s.name || s.skill || s.title || '';
        return {
          name: typeof nameVal === 'string' ? nameVal.trim() : String(nameVal).trim(),
          level: s.level || 'Intermediate',
        };
      }
      return null;
    })
    .filter((s) => s && s.name && s.name.length > 0);
};

// Helper function to sanitize expertise array
const sanitizeExpertise = (expertise, defaultExp = 3) => {
  if (!Array.isArray(expertise)) return [];
  return expertise
    .map((e) => {
      if (typeof e === 'string') {
        return { name: e.trim(), experience: defaultExp };
      }
      if (e && typeof e === 'object') {
        const nameVal = e.name || e.skill || e.title || '';
        return {
          name: typeof nameVal === 'string' ? nameVal.trim() : String(nameVal).trim(),
          experience: Number(e.experience) || defaultExp,
        };
      }
      return null;
    })
    .filter((e) => e && e.name && e.name.length > 0);
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (updateData.name && typeof updateData.name === 'string') {
    user.name = updateData.name.trim();
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

    if (updateData.socialLinks !== undefined) {
      profile.socialLinks = {
        github: updateData.socialLinks.github || profile.socialLinks?.github || '',
        linkedin: updateData.socialLinks.linkedin || profile.socialLinks?.linkedin || '',
        portfolio: updateData.socialLinks.portfolio || profile.socialLinks?.portfolio || '',
      };
    }

    if (updateData.skills !== undefined) {
      profile.skills = sanitizeSkills(updateData.skills);
    } else if (profile.skills) {
      // Ensure existing skills array is sanitized against missing name properties
      profile.skills = sanitizeSkills(profile.skills);
    }

    await profile.save();
  } else {
    profile = await MentorProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = new MentorProfile({ userId: user._id });
    }

    if (updateData.experience !== undefined) profile.experience = Number(updateData.experience) || 1;
    if (updateData.sessionPrice !== undefined || updateData.hourlyFee !== undefined) {
      profile.sessionPrice = Number(updateData.sessionPrice || updateData.hourlyFee) || 50;
    }
    if (updateData.bio !== undefined) profile.bio = updateData.bio;
    if (updateData.profileImage !== undefined || updateData.profilePicture !== undefined) {
      profile.profileImage = updateData.profileImage || updateData.profilePicture;
    }
    if (updateData.coverPicture !== undefined) profile.coverPicture = updateData.coverPicture;

    if (updateData.socialLinks !== undefined) {
      profile.socialLinks = {
        github: updateData.socialLinks.github || profile.socialLinks?.github || '',
        linkedin: updateData.socialLinks.linkedin || profile.socialLinks?.linkedin || '',
        portfolio: updateData.socialLinks.portfolio || profile.socialLinks?.portfolio || '',
      };
    }

    if (updateData.availability !== undefined) {
      profile.availability = Array.isArray(updateData.availability)
        ? updateData.availability
        : String(updateData.availability).split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (updateData.expertise !== undefined) {
      profile.expertise = sanitizeExpertise(updateData.expertise, profile.experience || 3);
    } else if (profile.expertise) {
      profile.expertise = sanitizeExpertise(profile.expertise, profile.experience || 3);
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
