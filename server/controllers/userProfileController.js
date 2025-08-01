const UserProfile = require("../models/UserProfile");
const Payment = require("../models/paymentConfirmation");
const jwt = require('jsonwebtoken');

const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }
    // Create profile object from form data
    const profileData = {
      userId,
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      height: req.body.height,
      religion: req.body.religion,
      caste: req.body.caste,
      education: req.body.education,
      occupation: req.body.occupation,
      income: req.body.income,
      bio: req.body.bio,
      isActive: true,
      maritalStatus:req.body.maritalStatus
    };

    if (req.file) {
      profileData.pic = req.file.path; 
    }
    const profile = await UserProfile.create(profileData);
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

getAllProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.find()
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


getProfileById = async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id)
        if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

getProfileByuserId = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({userId:req.params.id}).populate('userId', 'email phone') // Specify which user fields to include
    .exec();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if(profile.isActive){
   return res.json(profile);}
    else{
      return res.status(404).json({ message: "Profile not found" })    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file; // This comes from multer middleware
    // Find the existing profile
    const existingProfile = await UserProfile.findById(id);
    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Prepare update data
    const updateData = { ...updates };
    // Handle file upload if present
    if (file) {
      updateData.pic = req.file.path; // Adjust path as needed
      
      // Optional: Delete old file if it exists
      // if (existingProfile.pic) {
      //   const oldFilePath = path.join(__dirname, '..', 'public', existingProfile.pic);
      //   fs.unlink(oldFilePath, (err) => {
      //     if (err) console.error('Error deleting old file:', err);
      //   });
      // }
    }

    // Update the profile
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ 
      message: err.message,
      errors: err.errors // This will show validation errors if any
    });
  }
};

deleteProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findByIdAndUpdate(
      req.params.id,
      { isActive: false },  
      { new: true }        
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ 
      message: "Profile deactivated successfully",
      profile: profile 
    });
  } catch (err) {
    res.status(400).json({ 
      message: err.message,
      error: err // Include full error in development
    });
  }
};


// GET: /api/payments/verified/:agencyId

getSuccessfullyPaidUsers=async (req, res) => {
  try {
    const payments = await Payment.find({
      agencyId: req.params.agencyId,
      status: "verified",
    }).populate("userId");

    const userIds = payments.map((p) => p.userId._id);

    const profiles = await UserProfile.find({
      userId: { $in: userIds },
      isActive: true,
    });

    res.json({ success: true, profiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// controllers/userController.js

const getTokenVerification = async (req, res) => {
  try {
    const {token} = req.params;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(403).json({ message: "Token user mismatch" });
    }
    const profile = await UserProfile.findOne({_id:decoded.accessId})
    if(!profile){
      return res.status(404).json({ message: "Profile not found" });
    } 
    res.json(profile);

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


module.exports={
deleteProfile,
createProfile,
getAllProfiles,
getProfileById, updateProfile, getProfileByuserId,
getSuccessfullyPaidUsers,getTokenVerification
}


