const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', auth, authorize(['Admin', 'Librarian']), categoryController.addCategory);
router.delete('/:id', auth, authorize(['Admin', 'Librarian']), categoryController.deleteCategory);

module.exports = router;
