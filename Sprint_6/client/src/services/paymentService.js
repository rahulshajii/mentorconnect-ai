import API from './api';

export const createDemoOrder = async (courseId) => {
  const response = await API.post('/payments/demo/create', { courseId });
  return response.data;
};

export const confirmDemoPayment = async (orderId) => {
  const response = await API.post('/payments/demo/confirm', { orderId });
  return response.data;
};

export const getMyPayments = async () => {
  const response = await API.get('/payments/my');
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await API.get(`/payments/order/${orderId}`);
  return response.data;
};
