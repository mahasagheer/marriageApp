const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');

// Session routes
router.get('/sessions/unread-agency/:agencyId', chatController.getAgencyUnreadMessages);
router.post('/session', chatController.createOrGetSession);
router.get('/sessions/:role/:id', chatController.getSessionsByRole);
router.post('/mark-read', chatController.markMessagesAsRead);
 
// Message routes
router.get('/messages/:sessionId', chatController.getMessages);
router.post('/messages', chatController.sendMessage);

module.exports = router;
