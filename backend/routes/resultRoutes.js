// routes/resultRoutes.js
const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.get('/top', resultController.getTopResults);

router.get('/:userId', resultController.getResultByUserId);

module.exports = router;
