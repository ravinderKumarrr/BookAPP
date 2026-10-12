const Book = require('../models/Book');

// @route GET /api/books  (supports ?search=&category=&city=&sort=&condition=&page=&limit=)
const getBooks = async (req, res, next) => {
  try {
    const { search, category, city, condition, sort, page = 1, limit = 12, author, title } = req.query;
    const query = { status: 'available' };

    if (category) query.category = category;
    if (city) query.city = new RegExp(`^${city}$`, 'i');
    if (condition) query.condition = condition;
    if (author) query.author = new RegExp(author, 'i');
    if (title) query.title = new RegExp(title, 'i');

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [books, total] = await Promise.all([
      Book.find(query).populate('seller', 'name city').sort(sortOption).skip(skip).limit(Number(limit)),
      Book.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: 'Books fetched successfully',
      data: { books, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/books/search?q=
const searchBooks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ success: true, message: 'No query provided', data: { books: [] } });
    }
    const books = await Book.find({
      status: 'available',
      $or: [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }, { category: new RegExp(q, 'i') }],
    }).populate('seller', 'name city');
    res.status(200).json({ success: true, message: 'Search results fetched', data: { books } });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/books/category/:category
const getBooksByCategory = async (req, res, next) => {
  try {
    const books = await Book.find({ category: req.params.category, status: 'available' })
      .populate('seller', 'name city')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Books fetched by category', data: { books } });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/books/city/:city
const getBooksByCity = async (req, res, next) => {
  try {
    const books = await Book.find({ city: new RegExp(`^${req.params.city}$`, 'i'), status: 'available' })
      .populate('seller', 'name city')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Books fetched by city', data: { books } });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/books/:id
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('seller', 'name city email phone');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    book.views += 1;
    await book.save();
    res.status(200).json({ success: true, message: 'Book fetched successfully', data: { book } });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/books
const createBook = async (req, res, next) => {
  try {
    const { title, author, category, price, condition, description, images, city } = req.body;

    if (!title || !author || !category || !price || !condition || !description || !city) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const book = await Book.create({
      seller: req.user._id,
      title,
      author,
      category,
      price,
      condition,
      description,
      images: images || [],
      city,
    });

    res.status(201).json({ success: true, message: 'Book listed successfully', data: { book } });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/books/:id
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this book' });
    }

    Object.assign(book, req.body);
    await book.save();

    res.status(200).json({ success: true, message: 'Book updated successfully', data: { book } });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/books/:id
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this book' });
    }

    await book.deleteOne();

    res.status(200).json({ success: true, message: 'Book deleted successfully', data: {} });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/books/mine/listings
const getMyListings = async (req, res, next) => {
  try {
    const books = await Book.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'My listings fetched', data: { books } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  searchBooks,
  getBooksByCategory,
  getBooksByCity,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getMyListings,
};
