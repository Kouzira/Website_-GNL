const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, postController.getPosts);
router.post('/', authenticateToken, postController.createPost);

module.exports = router;
