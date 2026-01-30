const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.get('/stats', auth, authorize(['Admin', 'Librarian']), reportController.getDashboardStats);
router.get('/most-borrowed', auth, authorize(['Admin', 'Librarian']), reportController.getMostBorrowedBooks);

module.exports = router;
