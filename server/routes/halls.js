const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const availableDateController = require('../controllers/availableDateController');
const bookingController = require('../controllers/bookingController');
const Hall = require('../models/Hall');

router.get('/search', hallController.searchHalls);
router.get('/', auth, hallController.getHalls);
router.get('/public/:id', hallController.getPublicHallDetail);
router.get('/:id', auth, hallController.getHallById);
router.post('/', auth, upload.array('images', 5), hallController.createHall);
router.delete('/:id', auth, hallController.deleteHall);
router.put('/:id', auth, upload.array('images', 5), hallController.updateHall);
router.post('/:hallId/available-dates', auth, availableDateController.addAvailableDate);
router.get('/:hallId/available-dates', auth, availableDateController.getAvailableDatesForHall);
router.get('/owner/bookings', auth, bookingController.getOwnerBookings);
router.patch('/bookings/:id/status', auth, bookingController.updateBookingStatus);
router.post('/messages/send', bookingController.sendMessage);
router.get('/messages/:bookingId', bookingController.getMessages);
router.patch('/messages/:bookingId/read', bookingController.markMessagesRead);
router.get('/messages/all-sessions/:hallId', bookingController.getAllChatSessions);
router.post('/confirm-booking-from-chat', bookingController.confirmBookingFromChat);
router.get('/bookings/:id', auth, bookingController.getBookingById);
router.get('/manager/bookings', auth, bookingController.getManagerBookings);
router.get('/:hallId/bookings', auth, bookingController.getBookingsByHall);
router.get('/manager/halls', auth, hallController.getManagerHalls);

// Associate a manager with a hall (multi-manager, with department and tasks)
router.post('/:id/associate-manager', async (req, res) => {
  const { managerId, department, tasks } = req.body;
  if (!managerId || !department) {
    return res.status(400).json({ message: 'managerId and department are required' });
  }
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    // Check if manager already assigned
    const existing = hall.managers.find(m => m.manager.toString() === managerId);
    if (existing) {
      // Update department and tasks
      existing.department = department;
      existing.tasks = Array.isArray(tasks) ? tasks : [];
    } else {
      hall.managers.push({ manager: managerId, department, tasks: Array.isArray(tasks) ? tasks : [] });
    }
    await hall.save();
    await hall.populate('managers.manager');
    res.json(hall);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 