import api from './api';

const createOrder = async (payload) => {
  const res = await api.post('/orders', payload);
  return res.data.data.order;
};

const getOrders = async () => {
  const res = await api.get('/orders');
  return res.data.data.orders;
};

const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data.data.order;
};

const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data.data.order;
};

export default { createOrder, getOrders, getOrderById, updateOrderStatus };
