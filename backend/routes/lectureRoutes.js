const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');

// Tạo bài giảng mới cho một section
router.post('/:sectionId/lectures', lectureController.createLecture);

// Lấy tất cả các bài giảng của một section
router.get('/:sectionId/lectures', lectureController.getLectures);

// Cập nhật thông tin bài giảng
router.put('/:lectureId', lectureController.updateLecture);

// Xóa một bài giảng
router.delete('/:lectureId', lectureController.deleteLecture);

module.exports = router;
