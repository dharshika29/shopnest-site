import User from '../models/User.js';
import Message from '../models/Message.js';

let activeUsers = {}; // Map of userId -> socketId

const socketManager = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // When a user comes online
    socket.on('user-online', async (userId) => {
      activeUsers[userId] = socket.id;
      
      try {
        await User.findByIdAndUpdate(userId, { onlineStatus: true });
        io.emit('online-users', Object.keys(activeUsers));
      } catch (error) {
        console.error('Error updating online status', error);
      }
    });

    // The Multiple User Broadcast Logic
    // payload: { senderId, receiverIds: [id1, id2...], text, media }
    socket.on('send-message', async (payload) => {
      const { senderId, receiverIds, text, media } = payload;

      try {
        // Loop through each selected user
        for (let receiverId of receiverIds) {
          // 1. Create individual message entry in DB
          const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            text: text || '',
            media: media || ''
          });

          const populatedMessage = await newMessage.populate('sender', 'name profilePic');

          // 2. Check if receiver is online and emit
          const receiverSocketId = activeUsers[receiverId];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive-message', populatedMessage);
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Typing indicator
    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocketId = activeUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', senderId);
      }
    });

    // Handle Disconnect
    socket.on('disconnect', async () => {
      const userId = Object.keys(activeUsers).find(key => activeUsers[key] === socket.id);
      
      if (userId) {
        delete activeUsers[userId];
        try {
          await User.findByIdAndUpdate(userId, { onlineStatus: false });
          io.emit('online-users', Object.keys(activeUsers));
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
};

export default socketManager;
