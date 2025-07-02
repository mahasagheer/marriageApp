const mongoose = require('mongoose');

const customPackageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  description: { type: String },
  price: { type: Number, required: true },
  sentVia: { type: String, enum: ['email', 'chat'], required: true },
  accepted: { type: Boolean, default: false },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('CustomPackage', customPackageSchema); 