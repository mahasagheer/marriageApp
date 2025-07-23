const Decoration = require('../models/Decoration');
const Hall = require('../models/Hall');

// Create a new decoration for a hall
exports.createDecoration = async (req, res) => {
  try {
    const { hallId, name, price, addOns } = req.body;
    let hall;
    if (req.user.role === 'admin') {
      hall = await Hall.findById(hallId);
    } else if (req.user.role === 'manager') {
      hall = await Hall.findOne({ _id: hallId, 'managers.manager': req.user._id });
    } else {
      hall = await Hall.findOne({ _id: hallId, owner: req.user._id });
    }
    if (!hall) {
      return res.status(403).json({ message: 'Not authorized or hall not found' });
    }
    const decoration = new Decoration({
      hallId,
      name,
      price,
      addOns: addOns || []
    });
    const savedDecoration = await decoration.save();
    res.status(201).json(savedDecoration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all decorations for a specific hall
exports.getDecorationsByHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    let hall;
    if (req.user.role === 'admin') {
      hall = await Hall.findById(hallId);
    } else if (req.user.role === 'manager') {
      hall = await Hall.findOne({ _id: hallId, 'managers.manager': req.user._id });
    } else {
      hall = await Hall.findOne({ _id: hallId, owner: req.user._id });
    }
    if (!hall) {
      return res.status(403).json({ message: 'Not authorized or hall not found' });
    }
    const decorations = await Decoration.find({ hallId }).populate('hallId', 'name');
    res.json(decorations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all decorations for all halls owned by the user
exports.getOwnerDecorations = async (req, res) => {
  try {
    const halls = await Hall.find({ owner: req.user._id });
    const hallIds = halls.map(h => h._id);
    
    const decorations = await Decoration.find({ hallId: { $in: hallIds } }).populate('hallId', 'name');
    res.json(decorations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific decoration by ID
exports.getDecorationById = async (req, res) => {
  try {
    const { decorationId } = req.params;
    const decoration = await Decoration.findById(decorationId).populate('hallId');
    if (!decoration) {
      return res.status(404).json({ message: 'Decoration not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(decoration.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !decoration.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(decoration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a specific decoration
exports.updateDecoration = async (req, res) => {
  try {
    const { decorationId } = req.params;
    const { name, price, addOns } = req.body;
    const decoration = await Decoration.findById(decorationId).populate('hallId');
    if (!decoration) {
      return res.status(404).json({ message: 'Decoration not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(decoration.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !decoration.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Update fields
    if (name !== undefined) decoration.name = name;
    if (price !== undefined) decoration.price = price;
    if (addOns !== undefined) decoration.addOns = addOns;
    const updatedDecoration = await decoration.save();
    res.json(updatedDecoration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a specific decoration
exports.deleteDecoration = async (req, res) => {
  try {
    const { decorationId } = req.params;
    const decoration = await Decoration.findById(decorationId).populate('hallId');
    if (!decoration) {
      return res.status(404).json({ message: 'Decoration not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(decoration.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !decoration.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await decoration.deleteOne();
    res.json({ message: 'Decoration deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// Change status of a decoration
exports.changeDecorationStatus = async (req, res) => {
  try {
    const { decorationId } = req.params;
    const { status } = req.body;
    const decoration = await Decoration.findById(decorationId).populate('hallId');
    if (!decoration) {
      return res.status(404).json({ message: 'Decoration not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(decoration.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !decoration.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    decoration.status = status;
    await decoration.save();
    res.json({ decoration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 