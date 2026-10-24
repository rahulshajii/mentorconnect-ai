import API from './api';

export const createCourse = async (courseData) => {
  const response = await API.post('/admin/courses', courseData);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await API.put(`/admin/courses/${courseId}`, courseData);
  return response.data;
};

export const getAllEnrollments = async () => {
  const response = await API.get('/admin/enrollments');
  return response.data;
};

export const getAllPayments = async () => {
  const response = await API.get('/admin/payments');
  return response.data;
};

export const getAllCertificates = async () => {
  const response = await API.get('/admin/certificates');
  return response.data;
};

export const getAllEmailLogs = async () => {
  const response = await API.get('/admin/emails');
  return response.data;
};

export const retryEmail = async (emailLogId) => {
  const response = await API.post(`/email/${emailLogId}/retry`);
  return response.data;
};
