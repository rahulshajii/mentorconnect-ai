const skillGapService = require('../services/skillGapService');

const getSkillGap = async (req, res, next) => {
  try {
    const data = await skillGapService.analyzeSkillGap(req.user.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSkillGap,
};
