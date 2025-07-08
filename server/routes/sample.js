const express = require('express');
const router = express.Router();
const availableDateController = require('../controllers/availableDateController');
const auth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// @route   GET /api/sample
// @desc    Sample endpoint
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Sample route working!' });
});

router.get('/owner/available-dates', auth, availableDateController.getOwnerAvailableDates);
router.put('/available-dates/:dateId', auth, availableDateController.updateAvailableDate);
router.delete('/available-dates/:dateId', auth, availableDateController.deleteAvailableDate);
router.post('/public-booking', bookingController.createPublicBooking);

module.exports = router; 