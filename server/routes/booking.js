const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/custom-deal', bookingController.createCustomDeal);
router.get('/custom-deal/:token', bookingController.getCustomDealByToken);
router.post('/custom-deal/:token/confirm', bookingController.confirmCustomDeal);

module.exports = router; 