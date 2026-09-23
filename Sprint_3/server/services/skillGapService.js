const LearnerProfile = require('../models/LearnerProfile');
const QuizResult = require('../models/QuizResult');

// Benchmark required skills by target career goals
const GOAL_REQUIREMENTS = {
  'Full-Stack Engineer': ['React', 'Node.js', 'System Architecture', 'MongoDB', 'JavaScript'],
  'AI Engineer & Full-Stack Architect': ['Python', 'Machine Learning', 'React', 'Node.js', 'System Architecture'],
  'Frontend Developer': ['React', 'JavaScript', 'HTML/CSS', 'TypeScript', 'Redux'],
  'Backend Developer': ['Node.js', 'Python', 'System Architecture', 'MongoDB', 'SQL'],
};

const analyzeSkillGap = async (userId) => {
  const learnerProfile = await LearnerProfile.findOne({ userId });
  const recentQuizzes = await QuizResult.find({ userId });

  const careerGoal = learnerProfile?.careerGoal || 'Full-Stack Engineer';
  const currentSkills = learnerProfile?.skills || [];

  // Match required skills array or fallback to Full-Stack Engineer
  const matchedGoalKey = Object.keys(GOAL_REQUIREMENTS).find(
    (key) => key.toLowerCase() === careerGoal.toLowerCase()
  ) || 'Full-Stack Engineer';

  const requiredSkills = GOAL_REQUIREMENTS[matchedGoalKey];

  const strongSkills = [];
  const weakSkills = [];
  const missingSkills = [];

  const currentSkillNames = currentSkills.map((s) => s.name.toLowerCase());

  requiredSkills.forEach((reqSkill) => {
    const foundSkill = currentSkills.find((s) => s.name.toLowerCase() === reqSkill.toLowerCase());
    const relatedQuiz = recentQuizzes.find((q) => q.skill.toLowerCase() === reqSkill.toLowerCase());

    if (!foundSkill) {
      missingSkills.push({
        name: reqSkill,
        reason: 'Required for your target goal but missing from profile',
      });
    } else if (
      foundSkill.level === 'Advanced' ||
      foundSkill.level === 'Expert' ||
      (relatedQuiz && relatedQuiz.percentage >= 80)
    ) {
      strongSkills.push({
        name: reqSkill,
        level: foundSkill.level,
        score: relatedQuiz ? `${relatedQuiz.percentage}%` : 'Verified',
      });
    } else {
      weakSkills.push({
        name: reqSkill,
        level: foundSkill.level,
        score: relatedQuiz ? `${relatedQuiz.percentage}%` : 'Needs Assessment',
      });
    }
  });

  // Calculate Readiness Percentage Score
  const totalRequired = requiredSkills.length;
  const readinessPercentage = Math.round(
    ((strongSkills.length * 1 + weakSkills.length * 0.5) / totalRequired) * 100
  );

  return {
    careerGoal: matchedGoalKey,
    readinessPercentage,
    requiredSkills,
    strongSkills,
    weakSkills,
    missingSkills,
  };
};

module.exports = {
  analyzeSkillGap,
};
