const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');

// @route GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, message: 'Profile fetched', data: { user } });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, city, profileImage, password } = req.body;

    if (name) user.name = name;
    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Phone must be exactly 10 digits' });
      }
      user.phone = phone;
    }
    if (city) user.city = city;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          profileImage: user.profileImage,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/users/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [booksListed, booksSold, wishlistCount, activeOrders] = await Promise.all([
      Book.countDocuments({ seller: userId }),
      Book.countDocuments({ seller: userId, status: 'sold' }),
      Wishlist.countDocuments({ user: userId }),
      Order.countDocuments({ $or: [{ buyer: userId }, { seller: userId }], status: { $in: ['pending', 'accepted'] } }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched',
      data: { booksListed, booksSold, wishlistCount, activeOrders },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
