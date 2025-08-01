 // models/Agency.js
const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },

  businessNo: {
    type: String,
    required: true,
    unique: true
  },
  cnicNo: {
    type: String,
    unique: true
  },
  licenseNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  yearOfExp: {
    type: Number,
    required: true
  },
  verification: {
    type: String,
    enum: ['verified', 'pending', 'rejected'],
    default: 'pending'
  },
  images: [{
    type: String // Array of file paths or URLs
  }],
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  contactNo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
 
  isActive: {
    type: Boolean,

  },
  isVerified: {
    type: Boolean,
    default: false
  },
  displays: [{
    type: mongoose.Schema.Types.Mixed // For flexible display/form data
  }],
  formData: {
    type: mongoose.Schema.Types.Mixed // For additional form data storage
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agency', agencySchema);