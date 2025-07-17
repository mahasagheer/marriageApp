const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  proofImage: { type: String },
  paymentNumber: { type: String }, // Manager's shared payment number
  sharedByManager: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'awaiting_verification', 'verified', 'rejected', 'awaiting_payment'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Payment', paymentSchema); 