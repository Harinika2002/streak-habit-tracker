const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.getNotes);
router.post('/', noteController.createNote);
router.patch('/:id/pin', noteController.togglePin);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
