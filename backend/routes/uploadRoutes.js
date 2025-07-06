const express = require('express');
const multer = require('multer');
const router = express.Router();

// Khởi tạo multer để xử lý upload file
const upload = multer({ dest: 'uploads/' });

// API xử lý upload avatar
router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    res.send({ filePath: req.file.path });
});

module.exports = router;
