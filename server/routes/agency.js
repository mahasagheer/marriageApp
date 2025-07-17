// routes/agencyRoutes.js
const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// CRUD Routes
router.post('/',auth,upload.array('images', 5), agencyController.createAgency);
router.get('/',auth, agencyController.getAgencies);
router.get('/search',auth, agencyController.searchAgencies);
router.get('/:id',auth, agencyController.getAgency);
router.get('/profile/:id',auth, agencyController.getAgencybyUserId);
router.put('/:id',auth,upload.array('images', 5), agencyController.updateAgency);
router.delete('/:id', auth,agencyController.deleteAgency);


module.exports = router;