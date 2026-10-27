import axios from 'axios';

const API_URL = `${(import.meta.env.VITE_API_URL?.trim() || '').replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bookapp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bookapp_token');
      localStorage.removeItem('bookapp_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      (!error.response
        ? 'Unable to reach the BookApp server. Check that the backend is running and VITE_API_URL is configured correctly.'
        : '') ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
