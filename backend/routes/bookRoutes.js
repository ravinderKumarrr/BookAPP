const express = require('express');
const router = express.Router();
const {
  getBooks,
  searchBooks,
  getBooksByCategory,
  getBooksByCity,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getMyListings,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/city/:city', getBooksByCity);
router.get('/mine/listings', protect, getMyListings);
router.get('/', getBooks);
router.post('/', protect, createBook);
router.get('/:id', getBookById);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
