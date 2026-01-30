const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', bookController.getBooks);
router.post('/', auth, authorize(['Admin', 'Librarian']), bookController.addBook);
router.put('/:id', auth, authorize(['Admin', 'Librarian']), bookController.updateBook);
router.delete('/:id', auth, authorize(['Admin', 'Librarian']), bookController.deleteBook);

module.exports = router;
