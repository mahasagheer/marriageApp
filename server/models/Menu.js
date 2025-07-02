const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  items: [{ type: String }],
  basePrice: { type: Number, required: true },
  addOns: [{ name: String, price: Number }],
});

module.exports = mongoose.model('Menu', menuSchema); 