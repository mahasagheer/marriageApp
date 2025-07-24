const express = require('express');
const router = express.Router();
const matchmakingController = require('../controllers/matchPreferenceController');
const auth = require('../middleware/auth');

router.route('/')
  .post(auth, matchmakingController.createOrUpdatePreferences)
  .get(auth, matchmakingController.getUserPreferences)
  .delete(auth, matchmakingController.deletePreferences);

module.exports = router;