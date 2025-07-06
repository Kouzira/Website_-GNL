const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

router.get('/questions', examController.getExamQuestions);
router.post('/result', examController.saveResult);
router.get('/results', examController.getResults);

module.exports = router;
