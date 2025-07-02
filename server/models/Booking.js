const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  bookingDate: { type: Date, required: true },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  selectedAddOns: { type: mongoose.Schema.Types.Mixed },
  decorationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Decoration' }],
  isCustom: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 