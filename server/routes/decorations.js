const express = require('express');
const router = express.Router();
const decorationController = require('../controllers/decorationController');
const auth = require('../middleware/auth');

// Create a new decoration for a hall
router.post('/', auth, decorationController.createDecoration);

// Get all decorations for a specific hall
router.get('/hall/:hallId', auth, decorationController.getDecorationsByHall);

// Get all decorations for all halls owned by the user
router.get('/owner', auth, decorationController.getOwnerDecorations);

// Get a specific decoration by ID
router.get('/:decorationId', auth, decorationController.getDecorationById);

// Update a specific decoration
router.put('/:decorationId', auth, decorationController.updateDecoration);

// Delete a specific decoration
router.delete('/:decorationId', auth, decorationController.deleteDecoration);

router.patch('/:decorationId/status', auth, decorationController.changeDecorationStatus);

module.exports = router; 