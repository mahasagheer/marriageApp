const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 5), hallController.createHall);
router.get('/', auth, hallController.getHalls);
router.delete('/:id', auth, hallController.deleteHall);

module.exports = router; 