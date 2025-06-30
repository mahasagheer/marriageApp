const express = require('express');
const router = express.Router();

// @route   GET /api/sample
// @desc    Sample endpoint
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Sample route working!' });
});

module.exports = router; 