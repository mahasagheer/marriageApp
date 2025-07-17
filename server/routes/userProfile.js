const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createProfile, getProfileById, getAllProfiles, deleteProfile, updateProfile, getProfileByuserId } = require('../controllers/userProfileController');

// create user Profile
router.post('/', auth, upload.single('pic'), createProfile);


// get user profile by id
router.get("/:id",auth, getProfileById)

//  get profile by userId
router.get("/user/:id",auth, getProfileByuserId)


// get All regitered user Profile
router.get("/allProfiles", auth, getAllProfiles)

// delete user Profile
router.delete("/:id", auth, deleteProfile)

// update user profile 
router.put("/:id", auth,upload.single('pic'), updateProfile);

module.exports = router; 