const SavedAccount = require('../models/accounts');

// GET /api/saved-accounts/:agencyId
exports.getSavedAccounts = async (req, res) => {
  try {
    const accounts = await SavedAccount.find({ agencyId: req.params.agencyId });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved accounts' });
  }
};

// POST /api/saved-accounts
exports.saveNewAccount = async (req, res) => {
  const { agencyId, accountTitle, accountNumber, bankName } = req.body;

  try {
    const existing = await SavedAccount.findOne({ agencyId, accountNumber, bankName });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Account already saved' });
    }

    const account = new SavedAccount({ agencyId, accountTitle, accountNumber, bankName });
    await account.save();

    res.status(201).json({ success: true, account });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save account' });
  }
};
