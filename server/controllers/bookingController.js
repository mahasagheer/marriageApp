const Booking = require('../models/Booking');
const Hall = require('../models/Hall');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Message = require('../models/Message');

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
    // Find all messages for this hall
    const messages = await Message.find({ hallId }).sort({ createdAt: 1 });
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