import api from './api';

const getProfile = async () => {
  const res = await api.get('/users/profile');
  return res.data.data.user;
};

const updateProfile = async (payload) => {
  const res = await api.put('/users/profile', payload);
  return res.data.data.user;
};

const getDashboardStats = async () => {
  const res = await api.get('/users/dashboard-stats');
  return res.data.data;
};

export default { getProfile, updateProfile, getDashboardStats };
