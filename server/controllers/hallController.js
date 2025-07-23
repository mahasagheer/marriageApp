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

// Get all halls (role-based)
exports.getHalls = async (req, res) => {
  try {
    let halls;
    if (req.user.role === 'admin') {
      halls = await Hall.find().populate('managers.manager', 'name email');
    } else if (req.user.role === 'hall-owner') {
      halls = await Hall.find({ owner: req.user._id }).populate('managers.manager', 'name email');
    } else if (req.user.role === 'manager') {
      halls = await Hall.find({ 'managers.manager': req.user._id }).populate('managers.manager', 'name email');
    } else {
      return res.status(403).json({ message: 'Forbidden: Not authorized' });
    }
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change status of a hall (and related menus/decorations)
exports.changeHallStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const hall = await Hall.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true }
    );
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or not authorized' });
    }
    // Update all related menus and decorations
    await Promise.all([
      require('../models/Menu').updateMany({ hallId: hall._id }, { status }),
      require('../models/Decoration').updateMany({ hallId: hall._id }, { status }),
    ]);
    res.json({ message: `Hall and all related menus/decorations set to status: ${status}`, hall });
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
    let hall;
    if (req.user && req.user.role === 'admin') {
      hall = await Hall.findById(req.params.id).populate('managers.manager', 'name email');
    } else if (req.user && req.user.role === 'manager') {
      hall = await Hall.findOne({ _id: req.params.id, 'managers.manager': req.user._id }).populate('managers.manager', 'name email');
    } else {
      hall = await Hall.findOne({ _id: req.params.id, owner: req.user._id }).populate('managers.manager', 'name email');
    }
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or not authorized' });
    }
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public search for halls by name/location
exports.searchHalls = async (req, res) => {
  try {
    const { name, location } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    const halls = await Hall.find(query);
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public get hall detail by ID (with menus and decorations)
exports.getPublicHallDetail = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    const menus = await Menu.find({ hallId: hall._id });
    const decorations = await Decoration.find({ hallId: hall._id });
    res.json({ hall, menus, decorations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

// Get halls assigned to the logged-in manager
exports.getManagerHalls = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: Managers only' });
    }
    const halls = await Hall.find({ 'managers.manager': req.user._id }).populate('managers.manager', 'name email');
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 