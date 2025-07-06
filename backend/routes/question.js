const express = require('express');
const router = express.Router();
const multer = require('multer');
const questionController = require('../controllers/questionController');
const { authenticateToken, permit } = require('../middlewares/authMiddleware');

// Cấu hình multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Route để upload câu hỏi từ file Excel
router.post('/upload', upload.array('files', 10), questionController.uploadQuestions);

// Thêm câu hỏi thủ công
router.post('/', questionController.createQuestion);

// Lấy danh sách câu hỏi
router.get('/', questionController.getQuestions);

// Xóa tất cả câu hỏi (chỉ cho admin)
router.delete('/all', 
  (req, res, next) => {
    console.log('Delete all route hit');
    next();
  },
  authenticateToken,
  (req, res, next) => {
    console.log('After authentication:', req.user);
    next();
  },
  permit('admin'),
  (req, res, next) => {
    console.log('After permission check');
    next();
  },
  questionController.deleteAllQuestions
);

// Sửa câu hỏi theo id
router.put('/:id', questionController.updateQuestion);

// Xóa câu hỏi theo id
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
