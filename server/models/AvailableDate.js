const mongoose = require('mongoose');

const availableDateSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  date: { type: Date, required: true },
  isBooked: { type: Boolean, default: false }
});

module.exports = mongoose.model('AvailableDate', availableDateSchema); 