const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, settingsController.getSettings);
router.get('/:key', auth, settingsController.getSettingByKey);
router.post('/', auth, authorize('Admin'), settingsController.updateSetting);

module.exports = router;
