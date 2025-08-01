// controllers/agencyController.js
const Agency = require('../models/agencyProfile');

// Create a new agency
exports.createAgency = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if profile already exists
    const existingProfile = await Agency.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Agency Profile already exists" });
    }
    const images = req.files ? req.files.map(file => file.path) : [];

    const profileData = {
      userId,
      name: req.body.name,
      businessNo: req.body.businessNo,
      cnicNo: req.body.cnicNo,
      licenseNo: req.body.licenseNo,
      yearOfExp: req.body.yearOfExp,
      verification: req.body.verification,
      description: req.body.description,
      images,
      address: req.body.address || {},
      contactNo: req.body.contactNo,
      isActive: req.body.isActive,
      isVerified: req.body.isVerified,
      displays: req.body.displays || [],
      formData: req.body.formData || {},
    };



    const agency = new Agency(profileData);
    await agency.save();
    res.status(201).json({
      success: true,
      data: agency
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all agencies
exports.getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.status(200).json({
      success: true,
      count: agencies.length,
      data: agencies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single agency by ID
exports.getAgency = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) {
      return res.status(404).json({
        success: false,
        error: 'Agency not found'
      });
    }
    res.status(200).json({
      success: true,
      data: agency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// Get single agency by ID
exports.getAgencybyUserId = async (req, res) => {
  try {
    const agency = await Agency.findOne({ userId: req.params.id }).populate('userId', 'email phone') // Specify which user fields to include
      .exec();
    if (!agency) {
      return res.status(404).json({
        success: false,
        error: 'Agency not found'
      });
    }
  res.status(200).json({
    success: true,
    data: agency
  });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message 
    });
  }
};

// Update agency by ID
exports.updateAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;

    // Find the existing profile
    const existingProfile = await Agency.findById(id);
    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Prepare update data
    const updateData = { ...updates };

    // Handle file upload if present
    if (file) {

      updateData.images = req.files ? req.files.map(file => file.path) : [];
    }

    // Update the profile
    const updatedProfile = await Agency.findByIdAndUpdate(
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

// Delete agency by ID
exports.deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!agency) {
      return res.status(404).json({
        success: false,
        error: 'Agency not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Search agencies
exports.searchAgencies = async (req, res) => {
  const { name, businessNo, licenseNo, isVerified } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (businessNo) query.businessNo = businessNo;
  if (licenseNo) query.licenseNo = licenseNo;
  if (isVerified) query.isVerified = isVerified === 'true';

  try {
    const agencies = await Agency.find(query);
    res.status(200).json({
      success: true,
      count: agencies.length,
      data: agencies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
