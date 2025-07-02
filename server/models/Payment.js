const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  proofImage: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Payment', paymentSchema); 