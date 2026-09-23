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
    console.log('[DEBUG Express Controller updateProfile req.body]:', JSON.stringify(req.body, null, 2));

    // Step 9 Defensive Validation for skills array
    if (req.body.skills && Array.isArray(req.body.skills)) {
      for (let i = 0; i < req.body.skills.length; i++) {
        const item = req.body.skills[i];
        const nameVal = typeof item === 'string' ? item : item?.name;
        if (!nameVal || typeof nameVal !== 'string' || nameVal.trim() === '') {
          return res.status(400).json({
            message: `Skill name is required for skill at index ${i}`,
          });
        }
      }
    }

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
