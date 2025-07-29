const PaymentDetail = require('../models/paymentConfirmation');

// POST /api/payment/request
exports.createPayment = async (req, res) => {
  try {
    const {
      sessionId,
      userId,
      amount,
      currency,
      description,
      dueDate,
      bankName,
      accountNumber,
      accountTitle,
    } = req.body;

    const payment = new PaymentDetail({
      userId,
      sessionId,
      paymentDetails: {
        amount,
        currency,
        description,
        dueDate,
        bankName,
        accountNumber,
        accountTitle,
      },
      status: 'pending',
    });

    await payment.save();

    res.status(201).json({ success: true, message: 'Payment request saved', payment });
  } catch (err) {
    console.error('Payment save error:', err);
    res.status(500).json({ success: false, message: 'Failed to save payment request' });
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

exports.getLatestPayment = async (req, res) => {
  const { sessionId } = req.params;
  const latest = await PaymentDetail.findOne({ sessionId }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: latest
  });
};



// Update a payment detail
exports.updatePayment = async (req, res) => {
  const payment = await PaymentDetail.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Not found' });

  if (req.file) {
    payment.proofImage = req.file.path; // or Cloudinary URL
    payment.status = 'proof_uploaded';
    await payment.save();
 
    res.json({ message: 'Proof uploaded successfully.' ,payment});
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