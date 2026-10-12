import api from './api';

const getConversations = async () => {
  const res = await api.get('/messages');
  return res.data.data.conversations;
};

const getMessagesWithUser = async (userId) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data.data.messages;
};

const sendMessage = async (payload) => {
  const res = await api.post('/messages', payload);
  return res.data.data.message;
};

const markAsRead = async (id) => {
  const res = await api.put(`/messages/${id}/read`);
  return res.data.data.message;
};

export default { getConversations, getMessagesWithUser, sendMessage, markAsRead };
