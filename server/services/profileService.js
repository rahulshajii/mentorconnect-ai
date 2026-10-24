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
    if (!profile) {
      profile = await LearnerProfile.create({
        userId: user._id,
        education: 'Computer Science & Engineering',
        careerGoal: 'Full-Stack Software Engineer',
        skills: [
          { name: 'JavaScript', level: 'Intermediate' },
          { name: 'React', level: 'Intermediate' },
        ],
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
        bio: 'Passionate learner aiming to grow technical skills with MentorConnect AI.',
      });
    }
  } else if (user.role === 'mentor') {
    profile = await MentorProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await MentorProfile.create({
        userId: user._id,
        experience: 5,
        sessionPrice: 60,
        rating: 5.0,
        bio: 'Senior Technical Specialist and Mentor passionate about guiding developers.',
        expertise: [{ name: 'Software Architecture', experience: 5 }],
        availability: ['Monday - Friday: 10:00 AM - 04:00 PM'],
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
      });
    }
  } else {
    profile = {
      role: 'admin',
      name: user.name,
      bio: 'Platform Administrator with complete system management oversight.',
    };
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

// Robust Helper function to sanitize skills array
const sanitizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s) => {
      let nameStr = '';
      let levelStr = 'Intermediate';

      if (typeof s === 'string') {
        nameStr = s.trim();
      } else if (s && typeof s === 'object') {
        const doc = s._doc || s;
        nameStr = (doc.name || doc.skill || doc.title || '').toString().trim();
        levelStr = (doc.level || 'Intermediate').toString().trim();
      }

      if (!nameStr) return null;

      const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      if (!validLevels.includes(levelStr)) {
        levelStr = 'Intermediate';
      }

      return { name: nameStr, level: levelStr };
    })
    .filter(Boolean);
};

// Robust Helper function to sanitize expertise array
const sanitizeExpertise = (expertise, defaultExp = 3) => {
  if (!Array.isArray(expertise)) return [];
  return expertise
    .map((e) => {
      let nameStr = '';
      let expNum = defaultExp;

      if (typeof e === 'string') {
        nameStr = e.trim();
      } else if (e && typeof e === 'object') {
        const doc = e._doc || e;
        nameStr = (doc.name || doc.skill || doc.title || '').toString().trim();
        expNum = Number(doc.experience) || defaultExp;
      }

      if (!nameStr) return null;

      return { name: nameStr, experience: expNum };
    })
    .filter(Boolean);
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
      profile.skills = sanitizeSkills(profile.skills);
    }

    console.log('[DEBUG Mongoose LearnerProfile Pre-Save]:', JSON.stringify(profile.toObject(), null, 2));

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

    console.log('[DEBUG Mongoose MentorProfile Pre-Save]:', JSON.stringify(profile.toObject(), null, 2));

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
  const mentorUsers = await User.find({ role: 'mentor' }).select('-password');

  const profilesByUserId = new Map();
  mentors.forEach((mp) => {
    if (mp.userId) {
      const uId = (mp.userId._id || mp.userId).toString();
      profilesByUserId.set(uId, mp);
    }
  });

  const fullMentorsList = mentorUsers.map((u) => {
    const existingProfile = profilesByUserId.get(u._id.toString());
    if (existingProfile) {
      return existingProfile;
    }
    return {
      _id: u._id,
      userId: u,
      experience: 3,
      sessionPrice: 50,
      bio: 'Experienced industry professional dedicated to mentoring next-gen talent.',
      availability: ['Monday 10:00 AM - 12:00 PM', 'Wednesday 2:00 PM - 4:00 PM'],
      expertise: [{ name: 'Software Architecture', experience: 3 }],
      rating: 5.0,
    };
  });

  return fullMentorsList;
};

const getMentorById = async (mentorId) => {
  let profile = await MentorProfile.findById(mentorId).populate('userId', 'name email role');
  if (!profile) {
    profile = await MentorProfile.findOne({ userId: mentorId }).populate('userId', 'name email role');
  }
  if (!profile) {
    const user = await User.findById(mentorId).select('-password');
    if (user && user.role === 'mentor') {
      return {
        _id: user._id,
        userId: user,
        experience: 3,
        sessionPrice: 50,
        bio: 'Experienced industry professional dedicated to mentoring next-gen talent.',
        availability: ['Monday 10:00 AM - 12:00 PM', 'Wednesday 2:00 PM - 4:00 PM'],
        expertise: [{ name: 'Software Architecture', experience: 3 }],
        rating: 5.0,
      };
    }
  }
  return profile;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getMentorsList,
  getMentorById,
  sanitizeSkills,
  sanitizeExpertise,
};
