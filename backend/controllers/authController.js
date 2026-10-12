const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city,
  profileImage: user.profileImage,
  role: user.role,
  createdAt: user.createdAt,
});

// @route POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, city } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword || !city) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone must be exactly 10 digits' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase and a number',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, phone, password, city });

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: { user: sanitizeUser(user), token: generateToken(user._id) },
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: sanitizeUser(user), token: generateToken(user._id) },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'User fetched', data: sanitizeUser(req.user) });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logout successful', data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe, logout };
