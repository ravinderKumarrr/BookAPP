const Order = require('../models/Order');
const Book = require('../models/Book');
const Notification = require('../models/Notification');

// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { bookId, contactMessage } = req.body;

    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot order your own book' });
    }

    if (book.status !== 'available') {
      return res.status(400).json({ success: false, message: 'This book is no longer available' });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: book.seller,
      book: book._id,
      price: book.price,
      contactMessage: contactMessage || '',
    });

    book.status = 'pending';
    await book.save();

    await Notification.create({
      user: book.seller,
      type: 'order',
      message: `${req.user.name} requested to buy "${book.title}"`,
    });

    res.status(201).json({ success: true, message: 'Order created successfully', data: { order } });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/orders  (both buyer and seller orders)
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ $or: [{ buyer: req.user._id }, { seller: req.user._id }] })
      .populate('book', 'title images price')
      .populate('buyer', 'name city')
      .populate('seller', 'name city')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: 'Orders fetched', data: { orders } });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('book')
      .populate('buyer', 'name city phone email')
      .populate('seller', 'name city phone email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isParty =
      order.buyer._id.toString() === req.user._id.toString() || order.seller._id.toString() === req.user._id.toString();
    if (!isParty) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, message: 'Order fetched', data: { order } });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.seller.toString() !== req.user._id.toString() && order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    const book = await Book.findById(order.book);
    if (book) {
      if (status === 'completed') {
        book.status = 'sold';
        await book.save();
      } else if (status === 'rejected' || status === 'cancelled') {
        book.status = 'available';
        await book.save();
      }
    }

    await Notification.create({
      user: order.buyer.toString() === req.user._id.toString() ? order.seller : order.buyer,
      type: 'order',
      message: `Your order status changed to "${status}"`,
    });

    res.status(200).json({ success: true, message: 'Order status updated', data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
