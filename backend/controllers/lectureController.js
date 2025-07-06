const Lecture = require('../models/Lecture');
const Section = require('../models/Section');

// Tạo một bài giảng mới cho một section
const createLecture = async (req, res) => {
  const { sectionId } = req.params;  // Lấy ID của section từ request params
  const { title, contentType, content, videoFile, textFile } = req.body;  // Lấy thông tin bài giảng từ body request

  try {
    // Kiểm tra xem section có tồn tại hay không
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });  // Nếu không tìm thấy section, trả về lỗi 404
    }

    // Tạo một bài giảng mới
    const lecture = new Lecture({
      title,
      contentType,
      content,
      section: sectionId,
      videoFile, 
      textFile,  
    });

    await lecture.save();

    section.lectures.push(lecture._id);
    await section.save();  

    // Trả về bài giảng đã tạo
    res.status(201).json(lecture);
  } catch (error) {
    console.error('Error creating lecture:', error);  // Log lỗi để dễ dàng debug
    res.status(500).json({ message: 'Error creating lecture', error });  // Trả về lỗi server nếu có vấn đề xảy ra
  }
};

// Lấy tất cả các bài giảng của một section
const getLectures = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const lectures = await Lecture.find({ section: sectionId });
    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lectures', error });
  }
};

// Cập nhật thông tin của bài giảng
const updateLecture = async (req, res) => {
  const { lectureId } = req.params;
  const { title, contentType, content } = req.body;

  try {
    const lecture = await Lecture.findByIdAndUpdate(lectureId, { title, contentType, content }, { new: true });
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    res.json(lecture);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lecture', error });
  }
};

// Xóa một bài giảng
const deleteLecture = async (req, res) => {
  const { lectureId } = req.params;

  try {
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    // Xóa bài giảng khỏi section
    const section = await Section.findById(lecture.section);
    section.lectures = section.lectures.filter(id => id.toString() !== lectureId.toString());
    await section.save();

    res.json({ message: 'Lecture deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lecture', error });
  }
};

module.exports = { createLecture, getLectures, updateLecture, deleteLecture };
