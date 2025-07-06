const Hall = require('../models/Hall');
const AvailableDate = require('../models/AvailableDate');
const Menu = require('../models/Menu');
const Decoration = require('../models/Decoration');

exports.createHall = async (req, res) => {
  try {
    const { name, price, capacity, description, location, facilities, phone } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const hall = new Hall({
      name,
      price,
      capacity,
      description,
      location,
      phone,
      facilities: facilities || [],
      images,
      owner: req.user._id,
      createdBy: req.user._id
    });

    await hall.save();
    res.status(201).json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all halls for the logged-in owner
exports.getHalls = async (req, res) => {
  try {
    const halls = await Hall.find({ owner: req.user._id });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a hall by ID (only if owned by the user)
exports.deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findOne({ _id: req.params.id, owner: req.user._id });
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or not authorized' });
    }

    // Delete all associated data before deleting the hall
    await Promise.all([
      // Delete all available dates for this hall
      AvailableDate.deleteMany({ hallId: req.params.id }),
      // Delete all menus for this hall
      Menu.deleteMany({ hallId: req.params.id }),
      // Delete all decorations for this hall
      Decoration.deleteMany({ hallId: req.params.id })
    ]);

    // Delete the hall
    await hall.deleteOne();
    
    res.json({ message: 'Hall and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a hall by ID (only if owned by the user)
exports.updateHall = async (req, res) => {
  try {
    const { name, price, capacity, description, location, facilities, phone } = req.body;
    let updateData = { name, price, capacity, description, location, facilities, phone };

    // Handle images if provided
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    // Remove undefined fields (in case some are not sent)
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const hall = await Hall.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updateData },
      { new: true }
    );

    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or not authorized' });
    }
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single hall by ID (only if owned by the user)
exports.getHallById = async (req, res) => {
  try {
    const hall = await Hall.findOne({ _id: req.params.id, owner: req.user._id });
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or not authorized' });
    }
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 