// socket.js
const socketio = require('socket.io');
const ChatSession = require('./models/ChatSession');
const MatchRequest = require('./models/Session');

let io;

const initSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join room for specific chat session
    socket.on('join-chat', async ({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`User ${userId} joined chat ${chatId}`);
      
      // Mark messages as read when user joins
      await ChatSession.updateMany(
        { _id: chatId, 'messages.receiver': userId, 'messages.isRead': false },
        { $set: { 'messages.$[].isRead': true } }
      );
    });

    // Handle new messages
    socket.on('send-message', async ({ chatId, senderId, receiverId, content, messageType, formData, paymentDetails }) => {
      try {
        const newMessage = {
          sender: senderId,
          receiver: receiverId,
          content,
          messageType,
          formData,
          paymentDetails
        };

        const updatedChat = await ChatSession.findByIdAndUpdate(
          chatId,
          {
            $push: { messages: newMessage },
            $set: { lastMessageAt: Date.now() }
          },
          { new: true }
        ).populate('user agency');

        if (messageType === 'form-response') {
          // Update match request when form is filled
          await MatchRequest.findOneAndUpdate(
            { user: updatedChat.user._id, agency: updatedChat.agency._id },
            { formFilled: true, status: 'in-progress' }
          );
        }

        io.to(chatId).emit('receive-message', newMessage);
        
        // Notify receiver if they're not in the chat
        io.to(receiverId).emit('new-message-notification', {
          chatId,
          sender: senderId,
          content,
          messageType
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle payment confirmation
    socket.on('payment-confirmation', async ({ chatId, transactionId, amount }) => {
      try {
        const updatedChat = await ChatSession.findByIdAndUpdate(
          chatId,
          {
            $push: { 
              messages: {
                sender: 'system',
                receiver: chatId.user,
                content: `Payment of ${amount} received`,
                messageType: 'payment-confirmation',
                paymentDetails: {
                  status: 'paid',
                  amount,
                  transactionId
                }
              }
            }
          },
          { new: true }
        );

        // Update match request payment status
        await MatchRequest.findOneAndUpdate(
          { user: updatedChat.user, agency: updatedChat.agency },
          { 
            paymentStatus: amount === updatedChat.matchRequest.totalAmount ? 'completed' : 'partial',
            amountPaid: amount
          }
        );

        io.to(chatId).emit('payment-confirmed', {
          chatId,
          amount,
          transactionId
        });
      } catch (error) {
        console.error('Error confirming payment:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };