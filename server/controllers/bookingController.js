const Booking = require('../models/Booking');
const Hall = require('../models/Hall');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const halls = await Hall.find({ owner: ownerId });
    const hallIds = halls.map(h => h._id);
    const bookings = await Booking.find({ hallId: { $in: hallIds } }).populate('hallId');
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
      await transporter.sendMail({
        from: owner.email || process.env.EMAIL_USER,
        to: booking.guestEmail,
        subject,
        text,
        replyTo: owner.email || process.env.EMAIL_USER,
      });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 