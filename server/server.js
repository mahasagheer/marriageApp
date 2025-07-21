require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const socketio = require('socket.io');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

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
const menuRoutes = require('./routes/menus');

app.use('/api/auth', authRoutes);
// Register /api/users endpoint directly
app.use('/api', authRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/decorations', require('./routes/decorations'));
app.use('/api/bookings', bookingRoutes);
app.use('/api/booking', bookingRoutes);
app.use("/api/userProfile", userProfileRoutes)
app.use('/api/agency', agencyRoutes);
app.use('/api/menus', menuRoutes);
// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});

const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });
app.set('io', io);

io.on('connection', (socket) => {
  // Join a room for a specific booking
  socket.on('joinRoom', ({ hallId, bookingId }) => {
    socket.join(`${hallId}-${bookingId}`);
  });

  // Handle sending a message
  socket.on('sendMessage', async (msg) => {
    // Save to DB
    const message = await Message.create(msg);
    // Emit to room
    io.to(`${msg.hallId}-${msg.bookingId}`).emit('receiveMessage', message);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
