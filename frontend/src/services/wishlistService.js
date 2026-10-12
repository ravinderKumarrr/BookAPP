import api from './api';

const getWishlist = async () => {
  const res = await api.get('/wishlist');
  return res.data.data.items;
};

const addToWishlist = async (bookId) => {
  const res = await api.post(`/wishlist/${bookId}`);
  return res.data.data.item;
};

const removeFromWishlist = async (bookId) => {
  const res = await api.delete(`/wishlist/${bookId}`);
  return res.data;
};

export default { getWishlist, addToWishlist, removeFromWishlist };
