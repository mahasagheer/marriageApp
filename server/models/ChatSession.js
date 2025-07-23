// models/Message.js
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  sender: { type: String, enum: ['user','agency'], required: true },
  type: { type: String, enum: ['text','requestForm','formResponse','paymentRequest'], default: 'text' },
  text: { type: String },
  formLink: { type: String },
  formData: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false }, 
}, { timestamps: true });
module.exports = mongoose.model('Chat', messageSchema);
