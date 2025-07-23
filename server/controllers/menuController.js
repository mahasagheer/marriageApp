const Menu = require('../models/Menu');
const Hall = require('../models/Hall');

// Create a new menu for a hall
exports.createMenu = async (req, res) => {
  try {
    const { hallId, name, items, basePrice, addOns } = req.body;
    let hall;
    if (req.user.role === 'admin') {
      hall = await Hall.findById(hallId);
    } else if (req.user.role === 'manager') {
      hall = await Hall.findOne({ _id: hallId, 'managers.manager': req.user._id });
    } else {
      hall = await Hall.findOne({ _id: hallId, owner: req.user._id });
    }
    if (!hall) {
      return res.status(403).json({ message: 'Not authorized or hall not found' });
    }
    const menu = new Menu({
      name,
      hallId,
      items,
      basePrice,
      addOns: addOns || []
    });
    const savedMenu = await menu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all menus for a specific hall
exports.getMenusByHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    let hall;
    if (req.user.role === 'admin') {
      hall = await Hall.findById(hallId);
    } else if (req.user.role === 'manager') {
      hall = await Hall.findOne({ _id: hallId, 'managers.manager': req.user._id });
    } else {
      hall = await Hall.findOne({ _id: hallId, owner: req.user._id });
    }
    if (!hall) {
      return res.status(403).json({ message: 'Not authorized or hall not found' });
    }
    const menus = await Menu.find({ hallId }).populate('hallId', 'name');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all menus for all halls owned by the user
exports.getOwnerMenus = async (req, res) => {
  try {
    const halls = await Hall.find({ owner: req.user._id });
    const hallIds = halls.map(h => h._id);
    
    const menus = await Menu.find({ hallId: { $in: hallIds } }).populate('hallId', 'name');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific menu by ID
exports.getMenuById = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findById(menuId).populate('hallId');
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(menu.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !menu.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a specific menu
exports.updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name, items, basePrice, addOns } = req.body;
    const menu = await Menu.findById(menuId).populate('hallId');
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(menu.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !menu.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Update fields
    if (name !== undefined) menu.name = name;
    if (items !== undefined) menu.items = items;
    if (basePrice !== undefined) menu.basePrice = basePrice;
    if (addOns !== undefined) menu.addOns = addOns;
    const updatedMenu = await menu.save();
    res.json(updatedMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a specific menu
exports.deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findById(menuId).populate('hallId');
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(menu.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !menu.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await menu.deleteOne();
    res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// Change status of a menu
exports.changeMenuStatus = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { status } = req.body;
    const menu = await Menu.findById(menuId).populate('hallId');
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    // Check if user owns the hall or is admin or manager
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'manager' &&
      String(menu.hallId.owner) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (
      req.user.role === 'manager' &&
      !menu.hallId.managers.some(m => String(m.manager) === String(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    menu.status = status;
    await menu.save();
    res.json({ menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 