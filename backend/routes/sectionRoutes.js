const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

// Tạo section mới cho một khóa học
router.post('/:courseId/sections', sectionController.createSection);

// Lấy tất cả các section của một khóa học
router.get('/:courseId/sections', sectionController.getSections);

// Cập nhật thông tin của một section
router.put('/:sectionId', sectionController.updateSection);

// Xóa một section
router.delete('/:sectionId', sectionController.deleteSection);

module.exports = router;
