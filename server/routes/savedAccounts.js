const express = require('express');
const router = express.Router();
const {
  getSavedAccounts,
  saveNewAccount
} = require('../controllers/accounts');

// GET saved accounts
router.get('/:agencyId', getSavedAccounts);

// POST save new account
router.post('/', saveNewAccount);

module.exports = router;
