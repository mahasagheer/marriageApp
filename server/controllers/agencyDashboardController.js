const Chat = require('../models/ChatSession');
const MatchmakingPreference = require('../models/matchPreference');
const PaymentDetail = require('../models/paymentConfirmation');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile'); 

exports.getDashboardSummary = async (req, res) => {
  try {
    const activeConversations = await Chat.distinct('sessionId', { sender: 'user' }).then(s => s.length);

    const successfulMatches = 3; // Placeholder (replace with match model later)

    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyPayments = await PaymentDetail.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonthStart },
          status: 'verified'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentDetails.amount" }
        }
      }
    ]);
    const monthlyRevenue = monthlyPayments.length > 0 ? monthlyPayments[0].total : 0;

 

    res.json({
      activeConversations,
      successfulMatches,
      monthlyRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard summary' });
  }
};



exports.getMiniCards = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newUsersToday = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: today }
    });

    const pendingForms = await Chat.countDocuments({ type: 'requestForm', isRead: false });

    const completedForms = await Chat.countDocuments({ type: 'formResponse' });

    const todayRevenueAgg = await PaymentDetail.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: 'verified'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentDetails.amount" }
        }
      }
    ]);
    const todayRevenue = todayRevenueAgg.length ? todayRevenueAgg[0].total : 0;

    res.json([
      { title: "New Today", value: newUsersToday, icon: "FaUsers", color: "info" },
      { title: "Pending", value: pendingForms, icon: "FaClipboardList", color: "warning" },
      { title: "Completed", value: completedForms, icon: "FaCheckCircle", color: "success" },
      { title: "Revenue Today", value: `Rs. ${todayRevenue.toLocaleString()}`, icon: "FaMoneyBillWave", color: "secondary" }
    ]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mini cards' });
  }
};

exports.getMessagesStats = async (req, res) => {
  try {
    const activeConversations = await Chat.distinct('sessionId', { sender: 'user' }).then(s => s.length);
    const unreadMessages = await Chat.countDocuments({ isRead: false });

    res.json({
      activeConversations,
      unreadMessages
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch message stats' });
  }
};

exports.getFormStats = async (req, res) => {
  try {
    const pendingForms = await Chat.countDocuments({ type: 'requestForm', isRead: false });
    res.json({ pendingForms });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form stats' });
  }
};

exports.getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayAgg = await PaymentDetail.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: 'verified'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentDetails.amount" }
        }
      }
    ]);
    const todayTotal = todayAgg.length ? todayAgg[0].total : 0;

    const monthAgg = await PaymentDetail.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          status: 'verified'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentDetails.amount" }
        }
      }
    ]);
    const monthlyTotal = monthAgg.length ? monthAgg[0].total : 0;

    res.json({
      today: todayTotal,
      monthly: monthlyTotal,
      trend: { value: 8, label: "vs last month" } // optional enhancement later
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch revenue stats' });
  }
};

exports.getMatchStats = async (req, res) => {
  try {
    const successfulMatches = 56; // Replace with actual Match model count
    const conversionRate = 68;

    res.json({
      successfulMatches,
      conversionRate,
      trend: { matches: { value: 5, label: "vs last month" } }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch match stats' });
  }
};
