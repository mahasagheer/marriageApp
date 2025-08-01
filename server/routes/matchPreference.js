const express = require('express');
const router = express.Router();
const matchmakingController = require('../controllers/matchPreferenceController');
const auth = require('../middleware/auth');

router.route('/')
  .post(auth, matchmakingController.createOrUpdatePreferences)
  .delete(auth, matchmakingController.deletePreferences);
router.route("/:id")  .get(auth, matchmakingController.getUserPreferences)

module.exports = router;