const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');

router.get('/status', streakController.getStreakStatus);
router.post('/buy-freeze', streakController.buyStreakFreeze);

module.exports = router;
