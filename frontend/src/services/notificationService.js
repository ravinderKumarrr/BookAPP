import api from './api';

const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data.data.notifications;
};

const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data.data.notification;
};

export default { getNotifications, markNotificationRead };
