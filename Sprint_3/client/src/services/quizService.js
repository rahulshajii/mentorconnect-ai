import api from './api';

export const startQuiz = async (skill) => {
  const response = await api.post('/quiz/start', { skill });
  return response.data;
};

export const submitQuiz = async (skill, answers) => {
  const response = await api.post('/quiz/submit', { skill, answers });
  return response.data;
};
