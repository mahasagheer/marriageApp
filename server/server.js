require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const {Server} = require('socket.io');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// ✅ Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/sample', require('./routes/sample'));
const agencyRoutes= require('./routes/agency')
const authRoutes = require('./routes/auth');
const hallRoutes = require('./routes/halls');
const bookingRoutes = require('./routes/booking');
const userProfileRoutes= require('./routes/userProfile')
const ChatRoute=require('./routes/chat')
const menuRoutes = require('./routes/menus');
const matchPreferenceRoutes=require('./routes/matchPreference')
const paymentRoutes=require("./routes/paymentDetail")
const savedAccountRoutes = require('./routes/savedAccounts');
app.use('/api/saved-accounts', savedAccountRoutes);
app.use('/api/auth', authRoutes);
// Register /api/users endpoint directly
app.use('/api', authRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/decorations', require('./routes/decorations'));
app.use('/api/bookings', bookingRoutes);
app.use('/api/booking', bookingRoutes);
app.use("/api/userProfile", userProfileRoutes)
app.use('/api/agency', agencyRoutes);
app.use('/api/chat',ChatRoute)
app.use('/api/menus', menuRoutes);
app.use('/api/match-preference', matchPreferenceRoutes)
app.use('/api/payments',paymentRoutes)
// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});



app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinSession', ({ sessionId }) => {
    socket.join(sessionId);
    console.log(`Joined session ${sessionId}`);
  });

  socket.on('joinRoom', ({ hallId, bookingId }) => {
    socket.join(`${hallId}-${bookingId}`);
    console.log(`Joined room ${hallId}-${bookingId}`);
  });

  socket.on('sendMessage', async (msg) => {
    const message = await Message.create(msg);
    io.to(`${msg.hallId}-${msg.bookingId}`).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
