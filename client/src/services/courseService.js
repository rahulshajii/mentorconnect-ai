import API from './api';

export const getCourses = async (params = {}) => {
  const response = await API.get('/courses', { params });
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await API.get(`/courses/${id}`);
  return response.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await API.post(`/courses/${courseId}/enroll`);
  return response.data;
};

export const getMyCourses = async () => {
  const response = await API.get('/courses/my');
  return response.data;
};

export const updateLessonProgress = async (courseId, lessonId, isCompleted = true) => {
  const response = await API.put(`/courses/${courseId}/lessons/${lessonId}/progress`, { isCompleted });
  return response.data;
};

export const completeCourse = async (courseId, assessmentAnswers = {}) => {
  const response = await API.post(`/courses/${courseId}/complete`, { assessmentAnswers });
  return response.data;
};
