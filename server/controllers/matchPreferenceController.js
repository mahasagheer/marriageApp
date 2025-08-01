const MatchmakingPreference = require('../models/matchPreference');

// Create or Update Preferences
exports.createOrUpdatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const preferences = req.body;
    const existingPreference = await MatchmakingPreference.findOne({ user: userId });

    if (existingPreference) {
      // Update existing preferences
      const updatedPreference = await MatchmakingPreference.findOneAndUpdate(
        { user: userId },
        { preferences, lastUpdated: Date.now() },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        success: true,
        data: updatedPreference
      });
    } else {
      // Create new preferences
      const newPreference = await MatchmakingPreference.create({
        user: userId,
        preferences
      });
      res.status(201).json({
        success: true,
        data: newPreference
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Get User Preferences
exports.getUserPreferences = async (req, res) => {
  try {
    const preferences = await MatchmakingPreference.findOne({ user: req.params.id })
    // .populate('user', 'name email profilePicture');
    if (!preferences) {
      return res.status(404).json({
        success: false,
        error: 'No preferences found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Delete Preferences
exports.deletePreferences = async (req, res) => {
  try {
    await MatchmakingPreference.findOneAndDelete({ user: req.user._id });
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

