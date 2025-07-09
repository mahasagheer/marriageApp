const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  bookingId: { type: String }, // Accept both ObjectId and UUID string
  sender: { type: String, enum: ['client', 'owner'], required: true },
  senderEmail: { type: String },
  text: { type: String, required: true },
  type: { type: String }, // Add this line for message type
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema); 