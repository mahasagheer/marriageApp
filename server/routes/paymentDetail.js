const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentConfirmationController');

// Create a new payment detail
router.post('/', paymentController.createPayment);

// Get all payment details
router.get('/', paymentController.getAllPayments);

// Get payment details by user ID
router.get('/user/:userId', paymentController.getPaymentsByUser);

// Get a single payment detail by ID
router.get('/:id', paymentController.getPaymentById);

// Update a payment detail
router.patch('/:id', paymentController.updatePayment);

// Update payment status
router.patch('/:id/status', paymentController.updatePaymentStatus);

// Delete a payment detail
router.delete('/:id', paymentController.deletePayment);

module.exports = router;