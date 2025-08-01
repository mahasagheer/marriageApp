// models/SavedAccount.js
const mongoose = require('mongoose');

const savedAccountSchema = new mongoose.Schema({
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming 'User' model stores agency users
  accountTitle: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedAccount', savedAccountSchema);
