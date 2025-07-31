const PaymentDetail = require('../models/paymentConfirmation');
const AgencyProfile = require('../models/agencyProfile');
// POST /api/payment/request
exports.createPayment = async (req, res) => {
  try {
    const {
      sessionId,
      userId,
      amount,
      currency,
      agencyId,
      description,
      dueDate,
      bankName,
      accountNumber,
      accountTitle,
    } = req.body;

    const payment = new PaymentDetail({
      userId,
      sessionId,
      agencyId,
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




exports.getPaymentsByUser = async (req, res) => {
  try {
    // Get all payments of this user
    const payments = await PaymentDetail.find({ userId: req.params.userId });

    // Fetch agency profile for each agencyId using agencyId = userId of agency
    const paymentsWithAgency = await Promise.all(
      payments.map(async (payment) => {
        const agencyProfile = await AgencyProfile.findOne({ userId: payment.agencyId });
        return {
          ...payment._doc,
          agencyProfile, // attach full agency profile
        };
      })
    );

    res.status(200).json(paymentsWithAgency);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single payment detail by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await PaymentDetail.findById(req.params.id);
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
    const {id, status } = req.params;

    if (!['pending', 'proof_uploaded', 'verified', 'rejected',].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedPayment = await PaymentDetail.findByIdAndUpdate(
      id,
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
