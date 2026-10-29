const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/summary', statsController.getStatsSummary);

module.exports = router;
