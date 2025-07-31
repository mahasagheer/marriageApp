const Session = require('../models/Session');
const Message = require('../models/ChatSession');

// Create or get existing session
exports.createOrGetSession = async (req, res) => {
  try {
    const { userId, agencyId } = req.body;

    if (!userId || !agencyId) {
      return res.status(400).json({ error: 'userId and agencyId are required' });
    }

    let session = await Session.findOne({ userId, agencyId });

    if (!session) {
      session = await Session.create({ userId, agencyId });
    }

    // Optional: populate if frontend needs user/agency names/images
    session = await Session.findById(session._id).populate('userId agencyId');

    res.status(200).json(session);
  } catch (err) {
    console.error('Session error:', err);
    res.status(500).json({ error: 'Internal Server Error while creating/fetching session' });
  }
};

// Get sessions for user or agency
exports.getSessionsByRole = async (req, res) => {
  try {
    const { role, id } = req.params;
    const filter = role === 'user' ? { userId: id } : { agencyId: id };
    const sessions = await Session.find(filter).populate('agencyId userId').lean();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching sessions' });
  }
};

// Get all messages in a session
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// Get sessions with unread count for agency
exports.getAgencyUnreadMessages = async (req, res) => {
  try {
    const { role, id } = req.params;
    const filter = role === 'user' ? { userId: id } : { agencyId: id };
    const sessions = await Session.find(filter)
      .populate('userId agencyId')
      .lean();
    // Attach unread count to each session
    const sessionsWithUnread = await Promise.all(
      sessions.map(async (session) => {
        const unreadCount = await Message.countDocuments({
          sessionId: session._id,
          sender: role === 'user' ? 'agency' : 'user',        // ✅ only count user's unread messages
          isRead: false,
        });
        return { ...session, unreadCount };
      })
    );

    res.json(sessionsWithUnread);
  } catch (err) {
    console.error('Error fetching sessions with unread:', err);
    res.status(500).json({ error: 'Failed to fetch sessions with unread count' });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    req.io.to(req.body.sessionId.toString()).emit('newMessage', msg);
    res.json(msg);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error sending message' });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  const { sessionId, reader } = req.body;
  const opposite = reader === 'agency' ? 'user' : 'agency';

 const data= await Message.updateMany(
    { sessionId, sender: opposite, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ success: true, data });
};

