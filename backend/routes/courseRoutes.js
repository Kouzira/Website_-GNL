const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Tạo khóa học
router.post('/', courseController.createCourse);

// Lấy danh sách khóa học
router.get('/', courseController.getCourses);

// Cập nhật khóa học
router.put('/:id', courseController.updateCourse);

// Xóa khóa học
router.delete('/:id', courseController.deleteCourse);

// Lấy khóa học theo ID
router.get('/courses/:courseId', courseController.getCourseById);

module.exports = router;