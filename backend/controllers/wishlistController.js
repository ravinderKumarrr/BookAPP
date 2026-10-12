const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// @route GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate({
      path: 'book',
      populate: { path: 'seller', select: 'name city' },
    });
    res.status(200).json({ success: true, message: 'Wishlist fetched', data: { items } });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/wishlist/:bookId
const addToWishlist = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const existing = await Wishlist.findOne({ user: req.user._id, book: req.params.bookId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Book already in wishlist' });
    }

    const item = await Wishlist.create({ user: req.user._id, book: req.params.bookId });
    res.status(201).json({ success: true, message: 'Added to wishlist', data: { item } });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/wishlist/:bookId
const removeFromWishlist = async (req, res, next) => {
  try {
    const result = await Wishlist.findOneAndDelete({ user: req.user._id, book: req.params.bookId });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
    }
    res.status(200).json({ success: true, message: 'Removed from wishlist', data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
