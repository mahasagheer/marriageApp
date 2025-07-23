const mongoose = require('mongoose');

const decorationSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  addOns: [{ name: String, price: Number }],
  status: { type: String, enum: ['active', 'closed', 'open'], default: 'active' },
});

module.exports = mongoose.model('Decoration', decorationSchema); 