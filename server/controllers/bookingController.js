const Booking = require('../models/Booking');
const Hall = require('../models/Hall');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Message = require('../models/Message');
const Menu = require('../models/Menu');
const Decoration = require('../models/Decoration');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility to generate a unique token
function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Owner creates a custom deal and sends email
exports.createCustomDeal = async (req, res) => {
  try {
    const { hallId, guestName, guestEmail, guestPhone, menuId, selectedAddOns, decorationIds, bookingDate, price, message, menuItems, decorationItems } = req.body;
    if (!hallId || !guestEmail || !bookingDate) {
      return res.status(400).json({ message: 'hallId, guestEmail, and bookingDate are required' });
    }
    const token = generateToken();
    // Save as status 'custom-offer' (not shown in bookings table)
    const booking = new Booking({
      hallId,
      bookingDate,
      menuId,
      selectedAddOns,
      decorationIds,
      isCustom: true,
      status: 'custom-offer',
      guestName,
      guestEmail,
      guestPhone,
      customDealToken: token,
      price,
      message,
      menuItems: menuItems || [],
      decorationItems: decorationItems || [],
    });
    await booking.save();

    // Send email with booking link
    const bookingLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/custom-booking/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: guestEmail,
      subject: `Custom Deal for Your Event at Our Hall`,
      text: `Dear ${guestName},\n\nA custom deal has been created for you. Please review and confirm your booking here: ${bookingLink}\n\nDetails: ${message || ''}\n\nThank you!`,
    });

    res.status(201).json({ message: 'Custom deal created and email sent', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch custom deal by token
exports.getCustomDealByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const booking = await Booking.findOne({ customDealToken: token }).populate('hallId menuId decorationIds');
    if (!booking) return res.status(404).json({ message: 'Custom deal not found' });
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm custom deal booking
exports.confirmCustomDeal = async (req, res) => {
  try {
    const { token } = req.params;
    const booking = await Booking.findOne({ customDealToken: token });
    if (!booking) return res.status(404).json({ message: 'Custom deal not found' });
    // Only add to bookings table if not already confirmed
    if (booking.status !== 'pending') {
      booking.status = 'pending';
      await booking.save();
    }
    res.json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPublicBooking = async (req, res) => {
  try {
    const { hallId, bookingDate, menuId, selectedAddOns, decorationIds, guestName, guestEmail, guestPhone } = req.body;
    if (!hallId || !bookingDate) {
      return res.status(400).json({ message: 'hallId and bookingDate are required' });
    }
    const booking = new Booking({
      hallId,
      bookingDate,
      menuId,
      selectedAddOns,
      decorationIds,
      isCustom: true,
      status: 'pending',
      guestName,
      guestEmail,
      guestPhone,
    });
    await booking.save();
    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) io.emit('newBooking', booking);
    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In getOwnerBookings, only return bookings with status 'pending', 'approved', or 'rejected'
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const halls = await Hall.find({ owner: ownerId });
    const hallIds = halls.map(h => h._id);
    const bookings = await Booking.find({ hallId: { $in: hallIds }, status: { $in: ['pending', 'approved', 'rejected'] } }).populate('hallId');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const booking = await Booking.findById(id).populate('hallId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = status;
    await booking.save();

    // Fetch hall and owner info
    const hall = booking.hallId;
    const owner = await User.findById(hall.owner);

    console.log('Email Debug Info:');
    console.log('Guest Email:', booking.guestEmail);
    console.log('Owner Email:', owner?.email);
    console.log('Status:', status);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

    // Prepare email
    let subject, text;
    if (status === 'approved') {
      subject = `Your booking at ${hall.name} is confirmed!`;
      text = `Dear ${booking.guestName},\n\nYour booking at ${hall.name} on ${booking.bookingDate} has been confirmed by the owner.\n\nThank you!`;
    } else if (status === 'rejected') {
      subject = `Your booking at ${hall.name} was rejected`;
      text = `Dear ${booking.guestName},\n\nWe regret to inform you that your booking at ${hall.name} on ${booking.bookingDate} was rejected by the owner.\n\nPlease contact us for more info.`;
    }

    if (booking.guestEmail && (status === 'approved' || status === 'rejected')) {
      try {
        console.log('Attempting to send email...');
        await transporter.sendMail({
          from: owner.email || process.env.EMAIL_USER,
          to: booking.guestEmail,
          subject,
          text,
          replyTo: owner.email || process.env.EMAIL_USER,
        });
        console.log('Email sent successfully!');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }
    } else {
      console.log('No email sent - missing guest email or invalid status');
    }

    res.json({ booking });
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { hallId, bookingId, sender, senderEmail, text } = req.body;
    if (!hallId || !sender || !text) {
      return res.status(400).json({ message: 'hallId, sender, and text are required' });
    }
    const message = new Message({ hallId, bookingId, sender, senderEmail, text });
    await message.save();
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markMessagesRead = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reader } = req.body; // 'client' or 'owner'
    if (!bookingId || !reader) return res.status(400).json({ message: 'bookingId and reader required' });
    // Mark all messages for this booking not sent by the reader as read
    await Message.updateMany({ bookingId, sender: { $ne: reader }, read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllChatSessions = async (req, res) => {
  try {
    const { hallId } = req.params;
    let messages;
    if (!hallId || hallId === 'undefined') {
      // Admin: fetch all messages
      messages = await Message.find().sort({ createdAt: 1 });
    } else {
      // Owner/manager: fetch messages for specific hall
      messages = await Message.find({ hallId }).sort({ createdAt: 1 });
    }
    // Group by bookingId/chatSessionId
    const sessionMap = {};
    messages.forEach(msg => {
      const key = msg.bookingId?.toString();
      if (!sessionMap[key]) {
        sessionMap[key] = {
          bookingId: key,
          guestName: msg.sender === 'client' ? msg.guestName : undefined,
          guestEmail: msg.sender === 'client' ? msg.senderEmail : undefined,
          guestId: msg.sender === 'client' && !msg.senderEmail ? msg.guestId : undefined,
          lastMessage: msg,
        };
      } else {
        sessionMap[key].lastMessage = msg;
      }
    });
    const sessions = Object.values(sessionMap).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmBookingFromChat = async (req, res) => {
  try {
    const { hallId, bookingId, guestName, guestEmail, guestPhone, menuId, selectedAddOns, decorationIds, bookingDate, bookingTime } = req.body;
    if (!hallId || !guestEmail) {
      return res.status(400).json({ message: 'hallId and guestEmail are required' });
    }
    // Create booking
    const booking = new Booking({
      hallId,
      bookingDate: bookingDate || new Date(),
      menuId,
      selectedAddOns,
      decorationIds,
      isCustom: true,
      status: 'pending',
      guestName,
      guestEmail,
      guestPhone,
    });
    await booking.save();
    // Do not send email here; email is sent when owner approves/rejects
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('hallId')
      .populate('menuId')
      .populate('decorationIds');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingsByHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    const user = req.user;
    // Admin can access all
    if (user.role === 'admin') {
      const bookings = await Booking.find({ hallId }).populate('menuId').populate('decorationIds');
      return res.json(bookings);
    }
    // Owner can access their own halls
    if (user.role === 'hall-owner' && hall.owner.toString() === user._id.toString()) {
      const bookings = await Booking.find({ hallId }).populate('menuId').populate('decorationIds');
      return res.json(bookings);
    }
    // Manager can access assigned halls
    if (user.role === 'manager' && hall.managers.some(m => m.manager.toString() === user._id.toString())) {
    const bookings = await Booking.find({ hallId }).populate('menuId').populate('decorationIds');
      return res.json(bookings);
    }
    // Otherwise forbidden
    return res.status(403).json({ message: 'Forbidden: Not authorized to view bookings for this hall' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const bookings = await Booking.find().populate('hallId');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getManagerBookings = async (req, res) => {
  try {
    const managerId = req.user._id;
    // Find all halls where this user is a manager
    const halls = await Hall.find({ 'managers.manager': managerId });
    const hallIds = halls.map(h => h._id);
    const bookings = await Booking.find({ hallId: { $in: hallIds }, status: { $in: ['pending', 'approved', 'rejected'] } }).populate('hallId');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings (role-based)
exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find().populate('hallId');
    } else if (req.user.role === 'hall-owner') {
      const halls = await Hall.find({ owner: req.user._id });
      const hallIds = halls.map(h => h._id);
      bookings = await Booking.find({ hallId: { $in: hallIds } }).populate('hallId');
    } else if (req.user.role === 'manager') {
      const halls = await Hall.find({ 'managers.manager': req.user._id });
      const hallIds = halls.map(h => h._id);
      bookings = await Booking.find({ hallId: { $in: hallIds } }).populate('hallId');
    } else {
      return res.status(403).json({ message: 'Forbidden: Not authorized' });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manager shares payment number for a booking
exports.sharePaymentNumber = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentNumber } = req.body;
    if (!paymentNumber) return res.status(400).json({ message: 'Payment number required' });
    // Only manager (assigned) or admin can share payment number for assigned hall
    const booking = await Booking.findById(bookingId).populate('hallId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const hall = booking.hallId;
    // Prevent sharing payment for rejected bookings
    if (booking.status === 'rejected') {
      return res.status(403).json({ message: 'Cannot send payment request for a rejected booking.' });
    }
    if (
      req.user.role === 'manager' &&
      !hall.managers.some(m => m.manager.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Ensure booking has a customDealToken
    if (!booking.customDealToken) {
      booking.customDealToken = generateToken();
      await booking.save();
    }
    // Upsert payment record
    let payment = await Payment.findOne({ bookingId: booking._id });
    if (!payment) {
      payment = new Payment({
        userId: booking.userId,
        bookingId: booking._id,
        paymentNumber,
        sharedByManager: true,
        status: 'awaiting_payment',
      });
    } else {
      payment.paymentNumber = paymentNumber;
      payment.sharedByManager = true;
      payment.status = 'awaiting_payment';
    }
    await payment.save();
    // Send payment number to guest via email (if guestEmail exists)
    if (booking.guestEmail) {
      const bookingLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/custom-booking/${booking.customDealToken}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: booking.guestEmail,
        subject: `Payment Instructions for Your Booking at ${hall.name}`,
        text: `Dear ${booking.guestName || 'Guest'},\n\nPlease send your payment to: ${paymentNumber}\n\nYou can view your booking details and upload your payment screenshot here:\n${bookingLink}\n\nThank you!`,
      });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public endpoint: fetch booking and payment info by customDealToken
exports.getBookingAndPaymentByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const booking = await Booking.findOne({ customDealToken: token }).populate('hallId menuId decorationIds');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const payment = await Payment.findOne({ bookingId: booking._id });
    res.json({ booking, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User uploads payment proof (screenshot)
exports.uploadPaymentProof = async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Only user who made the booking can upload proof
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    let payment = await Payment.findOne({ bookingId: booking._id });
    if (!payment) {
      payment = new Payment({
        userId: req.user._id,
        bookingId: booking._id,
        status: 'awaiting_verification',
      });
    }
    payment.proofImage = req.file.path;
    payment.status = 'awaiting_verification';
    await payment.save();
    res.json({ message: 'Payment proof uploaded', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager or admin verifies or rejects payment
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body; // 'verified' or 'rejected'
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const payment = await Payment.findById(paymentId).populate({ path: 'bookingId', populate: { path: 'hallId' } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    const hall = payment.bookingId.hallId;
    // Prevent verifying/rejecting payment for rejected bookings
    if (payment.bookingId.status === 'rejected') {
      return res.status(403).json({ message: 'Cannot verify or reject payment for a rejected booking.' });
    }
    // Allow admin for any hall, manager only if assigned
    if (
      req.user.role === 'manager' &&
      !hall.managers.some(m => m.manager.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    payment.status = status;
    await payment.save();
    // Send email to client if guestEmail exists
    const guestEmail = payment.bookingId.guestEmail;
    const guestName = payment.bookingId.guestName || 'Guest';
    if (guestEmail) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: guestEmail,
        subject: `Payment ${status === 'verified' ? 'Verified' : 'Rejected'} for Your Booking`,
        text: `Dear ${guestName},\n\nYour payment for the booking at ${hall.name} has been ${status === 'verified' ? 'verified' : 'rejected'}.\n\nThank you!`,
      });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payment = await Payment.findOne({ bookingId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 