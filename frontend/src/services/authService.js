import api from './api';

const signup = async (payload) => {
  const res = await api.post('/auth/signup', payload);
  return res.data.data;
};

const login = async (payload) => {
  const res = await api.post('/auth/login', payload);
  return res.data.data;
};

const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};

const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export default { signup, login, getMe, logout };
