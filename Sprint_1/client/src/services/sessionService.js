import API from './api';

export const bookSession = async (bookingData) => {
  const response = await API.post('/sessions', bookingData);
  return response.data;
};

export const getLearnerSessions = async () => {
  const response = await API.get('/sessions/my');
  return response.data;
};

export const getMentorSessions = async () => {
  const response = await API.get('/sessions/mentor');
  return response.data;
};

export const updateSessionStatus = async (sessionId, status, cancellationReason = '') => {
  const response = await API.put(`/sessions/${sessionId}/status`, {
    status,
    cancellationReason,
  });
  return response.data;
};

export const getMentorAvailability = async (mentorId, date) => {
  const response = await API.get(`/sessions/availability/${mentorId}`, {
    params: { date },
  });
  return response.data;
};
