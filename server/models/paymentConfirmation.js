const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  proofImage: { type: String },
agencyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentDetails: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountTitle: { type: String, required: true },
  },

  status: {
    type: String,
    enum: ['pending', 'proof_uploaded', 'verified', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

module.exports = mongoose.model('PaymentDetail', paymentSchema);
