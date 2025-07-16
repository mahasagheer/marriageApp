// models/Agency.js
const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  businessNo: {
    type: String,
    required: true,
    unique: true
  },
  custcNo: {
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
  documents: [{
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
  profile: {
    type: String,
    default: ''
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