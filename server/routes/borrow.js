const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { auth, authorize } = require('../middleware/auth');

router.post('/borrow', auth, borrowController.borrowBook);
router.put('/return/:id', auth, borrowController.returnBook);
router.put('/renew/:id', auth, borrowController.renewBook);
router.get('/history', auth, borrowController.getBorrowHistory);

module.exports = router;
