require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

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
app.use('/api/auth', require('./routes/auth'));
const hallRoutes = require('./routes/halls');
app.use('/api/halls', hallRoutes);
app.use('/api/menus', require('./routes/menus'));
app.use('/api/decorations', require('./routes/decorations'));

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
