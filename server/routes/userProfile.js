const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createProfile,
  getProfileById,
  getAllProfiles,
  deleteProfile,
  updateProfile,
  getProfileByuserId,getSuccessfullyPaidUsers,
  getTokenVerification
} = require('../controllers/userProfileController');

// Create user Profile
router.post('/', auth, upload.single('pic'), createProfile);
router.get('/verified/:agencyId', auth, getSuccessfullyPaidUsers)
// ✅ Static or specific routes come BEFORE dynamic ones
router.get('/allProfiles', auth, getAllProfiles);
router.get('/user/:id', auth, getProfileByuserId);
router.get('/public/:token', getTokenVerification);

// 🚨 Dynamic routes last
router.get('/:id', auth, getProfileById);
router.delete('/:id', auth, deleteProfile);
router.put('/:id', auth, upload.single('pic'), updateProfile);

module.exports = router;
