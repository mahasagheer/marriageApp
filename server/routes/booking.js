const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/custom-deal', bookingController.createCustomDeal);
router.get('/custom-deal/:token', bookingController.getCustomDealByToken);
router.post('/custom-deal/:token/confirm', bookingController.confirmCustomDeal);
router.get('/all', auth, bookingController.getAllBookings);
router.get('/', auth, bookingController.getBookings);
// Manager shares payment number for a booking
router.post('/:bookingId/share-payment-number', auth, bookingController.sharePaymentNumber);
// User uploads payment proof (screenshot)
router.post('/:bookingId/upload-payment-proof', auth, upload.single('proofImage'), bookingController.uploadPaymentProof);
// Manager verifies or rejects payment
router.post('/payment/:paymentId/verify', auth, bookingController.verifyPayment);
// Fetch payment info for a booking
router.get('/payment/by-booking/:bookingId', auth, bookingController.getPaymentByBookingId);
// Public endpoint: fetch booking and payment info by customDealToken
router.get('/public/by-token/:token', bookingController.getBookingAndPaymentByToken);
// Public: User uploads payment proof (screenshot) without auth
router.post('/public/:bookingId/upload-payment-proof', upload.single('proofImage'), bookingController.uploadPaymentProof);

module.exports = router; 