const quizService = require('../services/quizService');

const startQuiz = async (req, res, next) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({ message: 'Skill domain is required to start assessment' });
    }

    const data = quizService.getQuestionsForSkill(skill);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { skill, answers } = req.body;
    if (!skill || !answers) {
      return res.status(400).json({ message: 'Skill domain and answers are required' });
    }

    const result = await quizService.submitAssessment(req.user.id, skill, answers);
    res.status(200).json({
      message: 'Assessment submitted successfully',
      result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  startQuiz,
  submitQuiz,
};
