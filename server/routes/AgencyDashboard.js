const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/agencyDashboardController');
const auth = require('../middleware/auth');

// Dashboard Summary
router.get('/summary',auth, dashboardController.getDashboardSummary);


// Mini Cards
router.get('/mini-cards',auth, dashboardController.getMiniCards);

// Messages & Conversations
router.get('/messages',auth, dashboardController.getMessagesStats);

// Pending Forms
router.get('/forms/pending',auth, dashboardController.getFormStats);

// Revenue
router.get('/revenue',auth, dashboardController.getRevenueStats);

// Matches
router.get('/matches',auth, dashboardController.getMatchStats);

module.exports = router;
