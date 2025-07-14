const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  bookingDate: { type: Date, required: true },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  selectedAddOns: { type: mongoose.Schema.Types.Mixed },
  decorationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Decoration' }],
  isCustom: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'custom-offer'], default: 'pending' },
  guestName: { type: String },
  guestEmail: { type: String },
  guestPhone: { type: String },
  customDealToken: { type: String },
  price: { type: Number },
  message: { type: String },
  menuItems: [{ type: String }],
  decorationItems: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 