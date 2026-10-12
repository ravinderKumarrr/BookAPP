const Message = require('../models/Message');
const Notification = require('../models/Notification');

// @route GET /api/messages  (list conversations - latest message per counterpart)
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({ $or: [{ sender: userId }, { receiver: userId }] })
      .populate('sender', 'name city')
      .populate('receiver', 'name city')
      .populate('book', 'title images')
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      const key = otherUser._id.toString();
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, { user: otherUser, lastMessage: msg });
      }
    });

    res.status(200).json({
      success: true,
      message: 'Conversations fetched',
      data: { conversations: Array.from(conversationsMap.values()) },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/messages/:userId  (thread with a specific user)
const getMessagesWithUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, message: 'Messages fetched', data: { messages } });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, bookId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Receiver and message are required' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      book: bookId || undefined,
      message,
    });

    await Notification.create({
      user: receiverId,
      type: 'message',
      message: `New message from ${req.user.name}`,
    });

    res.status(201).json({ success: true, message: 'Message sent', data: { message: newMessage } });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/messages/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    message.read = true;
    await message.save();
    res.status(200).json({ success: true, message: 'Message marked as read', data: { message } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getMessagesWithUser, sendMessage, markAsRead };
