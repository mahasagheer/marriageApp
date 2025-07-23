const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');

// Create a new menu for a hall
router.post('/', auth, menuController.createMenu);

// Get all menus for a specific hall
router.get('/hall/:hallId', auth, menuController.getMenusByHall);

// Get all menus for all halls owned by the user
router.get('/owner', auth, menuController.getOwnerMenus);

// Get a specific menu by ID
router.get('/:menuId', auth, menuController.getMenuById);

// Update a specific menu
router.put('/:menuId', auth, menuController.updateMenu);

// Delete a specific menu
router.delete('/:menuId', auth, menuController.deleteMenu);

router.patch('/:menuId/status', auth, menuController.changeMenuStatus);

module.exports = router; 