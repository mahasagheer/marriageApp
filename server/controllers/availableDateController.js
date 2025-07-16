const AvailableDate = require('../models/AvailableDate');
const Hall = require('../models/Hall');

// Add available date(s) for a hall
exports.addAvailableDate = async (req, res) => {
  try {
    const { hallId } = req.params;
    const { dates, isBooked } = req.body; // dates: array of ISO strings or a single date
    const hall = await Hall.findOne({ _id: hallId, owner: req.user._id });
    if (!hall) return res.status(403).json({ message: 'Not authorized or hall not found' });
    const dateArr = Array.isArray(dates) ? dates : [dates];
    const created = await AvailableDate.insertMany(dateArr.map(date => ({ hallId, date, isBooked: isBooked !== undefined ? isBooked : false })));
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all available dates for a specific hall
exports.getAvailableDatesForHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    // Allow owner, assigned manager, or admin
    const isOwner = hall.owner.toString() === req.user._id.toString();
    const isManager = hall.managers.some(m => m.manager.toString() === req.user._id.toString());
    if (!(isOwner || isManager || req.user.role === 'admin')) {
      return res.status(403).json({ message: 'Not authorized or hall not found' });
    }
    const dates = await AvailableDate.find({ hallId }).populate('hallId', 'name');
    res.json(dates.map(date => ({
      _id: date._id,
      date: date.date,
      isBooked: date.isBooked,
      hall: date.hallId
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all available dates for all halls owned by the user
exports.getOwnerAvailableDates = async (req, res) => {
  try {
    const halls = await Hall.find({ owner: req.user._id });
    const hallIds = halls.map(h => h._id);
    const dates = await AvailableDate.find({ hallId: { $in: hallIds } }).populate('hallId', 'name');
    res.json(dates.map(date => ({
      _id: date._id,
      date: date.date,
      isBooked: date.isBooked,
      hall: date.hallId
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a specific available date
exports.updateAvailableDate = async (req, res) => {
  try {
    const { dateId } = req.params;
    const dateDoc = await AvailableDate.findById(dateId).populate('hallId');
    if (!dateDoc) return res.status(404).json({ message: 'Date not found' });
    if (String(dateDoc.hallId.owner) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    const { date, isBooked } = req.body;
    if (date !== undefined) dateDoc.date = date;
    if (isBooked !== undefined) dateDoc.isBooked = isBooked;
    await dateDoc.save();
    res.json(dateDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a specific available date
exports.deleteAvailableDate = async (req, res) => {
  try {
    const { dateId } = req.params;
    const dateDoc = await AvailableDate.findById(dateId).populate('hallId');
    if (!dateDoc) return res.status(404).json({ message: 'Date not found' });
    if (String(dateDoc.hallId.owner) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    await dateDoc.deleteOne();
    res.json({ message: 'Available date deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 