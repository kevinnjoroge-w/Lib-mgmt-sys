const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fineController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, fineController.getFines);
router.put('/pay/:id', auth, authorize(['Admin', 'Librarian']), fineController.payFine);

module.exports = router;
