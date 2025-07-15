const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/custom-deal', bookingController.createCustomDeal);
router.get('/custom-deal/:token', bookingController.getCustomDealByToken);
router.post('/custom-deal/:token/confirm', bookingController.confirmCustomDeal);
router.get('/all', auth, bookingController.getAllBookings);

module.exports = router; 