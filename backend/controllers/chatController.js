import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get chat history between current user and a selected user
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const { userId } = req.params; // The person we are chatting with
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profilePic');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Contacts list)
// @route   GET /api/chat/users
// @access  Private
const getContacts = async (req, res, next) => {
  try {
    // Return all users except the current user
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export { getChatHistory, getContacts };
