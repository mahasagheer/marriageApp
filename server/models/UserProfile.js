const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive:{
    type:Boolean,
    required:true,
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  height: {
    type: String, 
    required: true
  },
  religion: {
    type: String,
    required: true
  },
  caste: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  interest:{
    type: String,
  },
  maritalStatus: {
    type: String
  },
  occupation: {
    type: String,
    required: true
  },
  income: {
    type: String, 
    required: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  pic: {
    type: String, 
    default: ""
  },
  file: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("UserProfile", userProfileSchema);
