const mongoose = require('mongoose');

// Sub-schema for range fields
const rangeSchema = new mongoose.Schema({
  min: { type: Number },
  max: { type: Number }
}, { _id: false });

// Preferences schema with nested schemas
const preferencesSchema = new mongoose.Schema({
  preferredAgeRange: {
    type: rangeSchema,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return value.min <= value.max;
      },
      message: 'Minimum age must be less than or equal to maximum age'
    }
  },
  preferredHeight: {
    type: rangeSchema,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return value.min <= value.max;
      },
      message: 'Minimum height must be less than or equal to maximum height'
    }
  },
  preferredIncome: {
    type: rangeSchema,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return value.min <= value.max;
      },
      message: 'Minimum income must be less than or equal to maximum income'
    }
  },
  preferredReligion: {
    type: String,
    enum: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other', 'No Preference']
  },
  preferredCaste: String,
  preferredEducation: {
    type: String,
    enum: ['High School', 'Bachelor', 'Master', 'PhD', 'Professional', 'No Preference']
  },
  preferredOccupation: String,
  otherPreferences: String,
  // locationPreferences: {
  //   country: String,
  //   state: String,
  //   city: String
  // }
}, { _id: false }); // No _id on sub-schema

// Main Matchmaking Schema
const matchmakingPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: preferencesSchema,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const MatchmakingPreference = mongoose.model('MatchmakingPreference', matchmakingPreferenceSchema);
module.exports = MatchmakingPreference;
