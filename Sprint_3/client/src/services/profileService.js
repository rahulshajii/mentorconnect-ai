import API from './api';

export const getProfile = async () => {
  const response = await API.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/profile', profileData);
  return response.data;
};

export const getMentors = async () => {
  const response = await API.get('/mentors');
  return response.data;
};

export const getMentorsList = async () => {
  const response = await API.get('/mentors');
  return response.data;
};

export const getMentorById = async (id) => {
  const response = await API.get(`/mentors/${id}`);
  return response.data;
};
