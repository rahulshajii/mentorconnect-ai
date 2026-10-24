const amieEngine = require('../services/amieEngine');

const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await amieEngine.getExplainableRecommendations(req.user.id);
    res.status(200).json({
      engine: 'AMIE v1.0',
      recommendations,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecommendations,
};
