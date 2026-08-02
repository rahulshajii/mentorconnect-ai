const profileService = require('../services/profileService');

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getUserProfile(req.user._id);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedProfile = await profileService.updateUserProfile(req.user._id, req.body);
    res.status(200).json({
      message: 'Profile updated successfully',
      ...updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

const getMentors = async (req, res, next) => {
  try {
    const mentors = await profileService.getMentorsList();
    res.status(200).json(mentors);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMentors,
};
