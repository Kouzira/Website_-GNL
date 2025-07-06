const Section = require('../models/Section');
const Course = require('../models/Course');

// Tạo một section mới cho khóa học
const createSection = async (req, res) => {
  const { courseId } = req.params;
  const { title, description } = req.body;

  try {
    const section = new Section({ title, description, course: courseId });
    await section.save();

    // Gắn section vào khóa học
    const course = await Course.findById(courseId);
    course.sections.push(section._id);
    await course.save();

    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error creating section', error });
  }
};

// Lấy tất cả các section của khóa học
const getSections = async (req, res) => {
  const { courseId } = req.params;
  
  try {
    console.log('Fetching sections for courseId:', courseId);  // Log courseId
    const sections = await Section.find({ course: courseId }).populate('lectures');
    console.log('Sections found:', sections);  // Log các section tìm được
    res.status(200).json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Error fetching sections', error });
  }
};

// Cập nhật thông tin của một section
const updateSection = async (req, res) => {
  const { sectionId } = req.params;
  const { title, description } = req.body;

  try {
    const section = await Section.findByIdAndUpdate(sectionId, { title, description }, { new: true });
    if (!section) return res.status(404).json({ message: 'Section not found' });

    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating section', error });
  }
};

// Xóa một section
const deleteSection = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    await Section.findByIdAndDelete(sectionId);

    // Xóa section khỏi khóa học
    const course = await Course.findById(section.course);
    course.sections = course.sections.filter(id => id.toString() !== sectionId.toString());
    await course.save();

    res.json({ message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting section', error });
  }
};

module.exports = { createSection, getSections, updateSection, deleteSection };
