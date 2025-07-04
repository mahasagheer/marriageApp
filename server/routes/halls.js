const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const availableDateController = require('../controllers/availableDateController');

router.post('/', auth, upload.array('images', 5), hallController.createHall);
router.get('/', auth, hallController.getHalls);
router.get('/:id', auth, hallController.getHallById);
router.delete('/:id', auth, hallController.deleteHall);
router.put('/:id', auth, upload.array('images', 5), hallController.updateHall);
router.post('/:hallId/available-dates', auth, availableDateController.addAvailableDate);
router.get('/:hallId/available-dates', auth, availableDateController.getAvailableDatesForHall);

module.exports = router; 