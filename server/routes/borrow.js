const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { auth, authorize } = require('../middleware/auth');

router.post('/borrow', auth, borrowController.borrowBook);
router.put('/return/:id', auth, borrowController.returnBook);
router.put('/renew/:id', auth, borrowController.renewBook);
router.get('/history', auth, borrowController.getBorrowHistory);
router.post('/reserve/:id', auth, borrowController.reserveBook);
router.get('/reservations/:id', auth, borrowController.getReservations);
router.get('/user-reservations', auth, borrowController.getUserReservations);

module.exports = router;
