const express = require('express');
const router = express.Router();
const { getConversations, getMessagesWithUser, sendMessage, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getConversations);
router.get('/:userId', protect, getMessagesWithUser);
router.post('/', protect, sendMessage);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
