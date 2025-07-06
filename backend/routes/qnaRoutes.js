const express = require('express');
const router = express.Router();
const qnaController = require('../controllers/qnaController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/questions', authenticateToken, qnaController.getQuestions);
router.post('/questions', authenticateToken, qnaController.createQuestion);
router.get('/questions/:qid/answers', authenticateToken, qnaController.getAnswers);
router.post('/questions/:qid/answers', authenticateToken, qnaController.createAnswer);

module.exports = router;
