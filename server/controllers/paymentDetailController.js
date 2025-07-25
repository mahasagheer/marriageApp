const PaymentDetail = require('../models/paymentConfirmation');

// Create a new payment detail
exports.createPayment = async (req, res) => {
  try {
    const { userId, proofImage, paymentDetails, status } = req.body;
    
    const paymentDetail = new PaymentDetail({
      userId,
      proofImage,
      paymentDetails,
      status: status || 'pending'
    });

    const savedPayment = await paymentDetail.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all payment details
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentDetail.find().populate('userId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment details by user ID
exports.getPaymentsByUser = async (req, res) => {
  try {
    const payments = await PaymentDetail.find({ userId: req.params.userId }).populate('userId');
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single payment detail by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await PaymentDetail.findById(req.params.id).populate('userId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a payment detail
exports.updatePayment = async (req, res) => {
  try {
    const { proofImage, paymentDetails, status } = req.body;
    const updateFields = {};
    
    if (proofImage) updateFields.proofImage = proofImage;
    if (paymentDetails) updateFields.paymentDetails = paymentDetails;
    if (status) updateFields.status = status;

    const updatedPayment = await PaymentDetail.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('userId');

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'awaiting_verification', 'verified', 'rejected', 'awaiting_payment'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedPayment = await PaymentDetail.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId');

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a payment detail
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await PaymentDetail.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};