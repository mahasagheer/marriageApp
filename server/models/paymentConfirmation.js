const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proofImage: { type: String },
  sessionId:{type:mongoose.Schema.Types.ObjectId, ref:'Session', required:true},
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'awaiting_verification', 'verified', 'rejected', 'awaiting_payment'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('PaymentDetail', paymentSchema); 