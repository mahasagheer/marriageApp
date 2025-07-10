const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const availableDateController = require('../controllers/availableDateController');
const bookingController = require('../controllers/bookingController');

router.get('/search', hallController.searchHalls);
router.get('/', hallController.getHalls);
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
router.get('/:hallId/bookings', auth, bookingController.getBookingsByHall);

module.exports = router; 