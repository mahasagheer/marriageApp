const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentDetailController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Create a new payment detail
router.post('/', paymentController.createPayment);

// Get all payment details
router.get('/', paymentController.getAllPayments);

// Get payment details by user ID
router.get('/user/:userId', paymentController.getPaymentsByUser);

router.get('/payment/:id', paymentController.getPaymentById);

// Get a single payment detail by ID
router.get('/:sessionId', paymentController.getLatestPayment);

// Update a payment detail
router.put('/:id/upload-proof',auth, upload.single('proofImage'),paymentController.updatePayment)
// Update payment status
router.put('/:id/:status', paymentController.updatePaymentStatus);


module.exports = router;