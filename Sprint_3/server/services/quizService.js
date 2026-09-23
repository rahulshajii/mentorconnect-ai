const QuizResult = require('../models/QuizResult');
const LearnerProfile = require('../models/LearnerProfile');

// Comprehensive Question Bank grouped by skill domain
const QUESTION_BANK = {
  React: [
    {
      id: 'q_react_1',
      question: 'Which Hook is used to perform side effects in functional components?',
      type: 'single',
      difficulty: 'Easy',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correct: ['useEffect'],
    },
    {
      id: 'q_react_2',
      question: 'What is the primary purpose of React.memo()?',
      type: 'single',
      difficulty: 'Medium',
      options: [
        'To cache API responses',
        'To prevent re-rendering when props have not changed',
        'To manage global application state',
        'To perform asynchronous state updates',
      ],
      correct: ['To prevent re-rendering when props have not changed'],
    },
    {
      id: 'q_react_3',
      question: 'Which of the following are valid rules of React Hooks? (Select all that apply)',
      type: 'multiple',
      difficulty: 'Hard',
      options: [
        'Only call Hooks at the top level',
        'Call Hooks inside regular JavaScript functions',
        'Only call Hooks from React function components or custom Hooks',
        'Call Hooks inside nested loops or conditions',
      ],
      correct: [
        'Only call Hooks at the top level',
        'Only call Hooks from React function components or custom Hooks',
      ],
    },
  ],
  'Node.js': [
    {
      id: 'q_node_1',
      question: 'What is the Event Loop in Node.js primarily responsible for?',
      type: 'single',
      difficulty: 'Easy',
      options: [
        'Multi-threading execution',
        'Handling asynchronous non-blocking I/O operations',
        'Compiling JavaScript to C++',
        'Managing SQL database connections',
      ],
      correct: ['Handling asynchronous non-blocking I/O operations'],
    },
    {
      id: 'q_node_2',
      question: 'Which core module is used to handle file paths across operating systems?',
      type: 'single',
      difficulty: 'Easy',
      options: ['fs', 'path', 'url', 'http'],
      correct: ['path'],
    },
    {
      id: 'q_node_3',
      question: 'Which statements about Node.js streams are correct? (Select all that apply)',
      type: 'multiple',
      difficulty: 'Medium',
      options: [
        'Streams process data in chunks without loading everything into memory',
        'Readable streams emit data events',
        'Streams only support text data, not binary Buffers',
        'pipe() connects a readable stream to a writable stream',
      ],
      correct: [
        'Streams process data in chunks without loading everything into memory',
        'Readable streams emit data events',
        'pipe() connects a readable stream to a writable stream',
      ],
    },
  ],
  Python: [
    {
      id: 'q_py_1',
      question: 'What keyword is used to create a generator function in Python?',
      type: 'single',
      difficulty: 'Easy',
      options: ['return', 'yield', 'async', 'lambda'],
      correct: ['yield'],
    },
    {
      id: 'q_py_2',
      question: 'Which built-in data structure is immutable in Python?',
      type: 'single',
      difficulty: 'Easy',
      options: ['List', 'Dictionary', 'Tuple', 'Set'],
      correct: ['Tuple'],
    },
    {
      id: 'q_py_3',
      question: 'What is the purpose of the GIL (Global Interpreter Lock) in CPython?',
      type: 'single',
      difficulty: 'Hard',
      options: [
        'To speed up parallel thread execution',
        'To synchronize thread execution and ensure thread safety for Python objects',
        'To handle garbage collection automatically',
        'To compile Python bytecode into C binary',
      ],
      correct: ['To synchronize thread execution and ensure thread safety for Python objects'],
    },
  ],
  'System Architecture': [
    {
      id: 'q_sys_1',
      question: 'What does CAP theorem state about distributed databases during network partitions?',
      type: 'single',
      difficulty: 'Medium',
      options: [
        'A system can provide Consistency, Availability, and Partition Tolerance simultaneously',
        'A system must choose between Consistency and Availability during a Partition',
        'Partition Tolerance is optional in modern networks',
        'Consistency and Availability are mutually exclusive under normal operations',
      ],
      correct: ['A system must choose between Consistency and Availability during a Partition'],
    },
    {
      id: 'q_sys_2',
      question: 'Which mechanisms are commonly used for database load balancing? (Select all that apply)',
      type: 'multiple',
      difficulty: 'Hard',
      options: [
        'Read Replicas with Primary/Secondary Replication',
        'Horizontal Database Sharding',
        'Single-instance In-Memory Caching',
        'Connection Pooling with Proxy Routers',
      ],
      correct: [
        'Read Replicas with Primary/Secondary Replication',
        'Horizontal Database Sharding',
        'Connection Pooling with Proxy Routers',
      ],
    },
  ],
};

const getQuestionsForSkill = (skill) => {
  const normalized = Object.keys(QUESTION_BANK).find(
    (key) => key.toLowerCase() === skill.toLowerCase()
  ) || 'React';

  const questions = QUESTION_BANK[normalized].map(({ correct, ...q }) => q);
  return { skill: normalized, questions, timerSeconds: 180 };
};

const submitAssessment = async (userId, skill, userAnswers) => {
  const normalized = Object.keys(QUESTION_BANK).find(
    (key) => key.toLowerCase() === skill.toLowerCase()
  ) || 'React';

  const questionSet = QUESTION_BANK[normalized];
  let totalScore = 0;
  const processedAnswers = [];

  questionSet.forEach((q) => {
    const userAnswer = userAnswers[q.id] || [];
    const selected = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    const isCorrect =
      selected.length === q.correct.length &&
      selected.every((val) => q.correct.includes(val));

    if (isCorrect) totalScore += 1;

    processedAnswers.push({
      questionId: q.id,
      question: q.question,
      selectedAnswer: selected,
      correctAnswer: q.correct,
      isCorrect,
    });
  });

  const percentage = Math.round((totalScore / questionSet.length) * 100);

  let levelAssessed = 'Beginner';
  if (percentage >= 85) levelAssessed = 'Expert';
  else if (percentage >= 70) levelAssessed = 'Advanced';
  else if (percentage >= 50) levelAssessed = 'Intermediate';

  const result = await QuizResult.create({
    userId,
    skill: normalized,
    score: totalScore,
    totalQuestions: questionSet.length,
    percentage,
    levelAssessed,
    answers: processedAnswers,
  });

  // Update learner profile skill level automatically
  const learnerProfile = await LearnerProfile.findOne({ userId });
  if (learnerProfile) {
    const existingSkillIdx = learnerProfile.skills.findIndex(
      (s) => s.name.toLowerCase() === normalized.toLowerCase()
    );

    if (existingSkillIdx >= 0) {
      learnerProfile.skills[existingSkillIdx].level = levelAssessed;
    } else {
      learnerProfile.skills.push({ name: normalized, level: levelAssessed });
    }
    await learnerProfile.save();
  }

  return result;
};

module.exports = {
  getQuestionsForSkill,
  submitAssessment,
};
