import api from './api';

const getBooks = async (params = {}) => {
  const res = await api.get('/books', { params });
  return res.data.data;
};

const getBookById = async (id) => {
  const res = await api.get(`/books/${id}`);
  return res.data.data.book;
};

const getBooksByCategory = async (category) => {
  const res = await api.get(`/books/category/${encodeURIComponent(category)}`);
  return res.data.data.books;
};

const searchBooks = async (q) => {
  const res = await api.get('/books/search', { params: { q } });
  return res.data.data.books;
};

const createBook = async (payload) => {
  const res = await api.post('/books', payload);
  return res.data.data.book;
};

const updateBook = async (id, payload) => {
  const res = await api.put(`/books/${id}`, payload);
  return res.data.data.book;
};

const deleteBook = async (id) => {
  const res = await api.delete(`/books/${id}`);
  return res.data;
};

const getMyListings = async () => {
  const res = await api.get('/books/mine/listings');
  return res.data.data.books;
};

export default { getBooks, getBookById, getBooksByCategory, searchBooks, createBook, updateBook, deleteBook, getMyListings };
