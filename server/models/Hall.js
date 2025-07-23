const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  phone: { type: String },
  images: [{ type: String }],
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  facilities: [{ type: String }],
  managers: [
    {
      manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      department: { type: String },
      tasks: [{ type: String }],
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: {
    type: require('mongoose').Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: { type: String, enum: ['active', 'closed', 'open'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema); 