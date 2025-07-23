const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const availableDateController = require('../controllers/availableDateController');
const bookingController = require('../controllers/bookingController');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Hall = require('../models/Hall');

router.get('/search', hallController.searchHalls);
router.get('/', auth, hallController.getHalls);
router.get('/public/:id', hallController.getPublicHallDetail);
router.get('/:id', auth, hallController.getHallById);
router.post('/', auth, upload.array('images', 5), hallController.createHall);
router.patch('/:id/status', auth, hallController.changeHallStatus);
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
    let isNewAssignment = false;
    if (existing) {
      // Update department and tasks
      existing.department = department;
      existing.tasks = Array.isArray(tasks) ? tasks : [];
    } else {
      hall.managers.push({ manager: managerId, department, tasks: Array.isArray(tasks) ? tasks : [] });
      isNewAssignment = true;
    }
    await hall.save();
    await hall.populate('managers.manager');

    // Send email to manager if newly assigned
    if (isNewAssignment) {
      // Get manager user
      const managerUser = await User.findById(managerId);
      if (managerUser && managerUser.email) {
        // Use the same transporter as bookingController
        const transporter = require('nodemailer').createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: managerUser.email,
          subject: `Hall Assigned: ${hall.name}`,
          text: `Dear ${managerUser.name},\n\nYou have been assigned as a manager for the following hall:\n\nHall: ${hall.name}\nLocation: ${hall.location}\nDepartment: ${department}\n\nPlease log in to your account to view more details.\n\nThank you!`,
        });
      }
    }

    res.json(hall);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 