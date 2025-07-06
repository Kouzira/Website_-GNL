const Course = require('../models/Course');
const Section = require('../models/Section');

// Tạo khóa học
const createCourse = async (req, res) => {
  const { name, price, instructor, description, sections } = req.body;
  console.log('Received course data:', req.body);  // Log dữ liệu nhận được từ frontend

  try {
    const newCourse = new Course({ name, price, instructor, description });
    await newCourse.save();

    // Log xem khóa học đã được lưu thành công hay chưa
    console.log('New course created:', newCourse);

    if (sections && sections.length > 0) {
      for (const section of sections) {
        const newSection = new Section({
          title: section.title,
          description: section.description,
          course: newCourse._id,
        });
        await newSection.save();
      }
    }

    res.status(201).json(newCourse);  // Trả về khóa học đã tạo
  } catch (error) {
    console.error('Error creating course:', error);  // Log lỗi khi có vấn đề xảy ra
    res.status(500).json({ message: 'Error creating course', error });
  }
};

// Lấy danh sách khóa học
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('sections');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};


// Lấy khóa học theo ID
const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('sections');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

module.exports = { getCourses, getCourseById };

// Cập nhật khóa học
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, price, instructor, description, sections } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(id, { name, price, instructor, description, sections }, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error updating course:', error);  // Log lỗi backend
    res.status(500).json({ message: 'Error updating course', error });
  }
};

// Xóa khóa học
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Section.deleteMany({ course: id });  // Xóa tất cả section của khóa học
    await Course.findByIdAndDelete(id);  // Xóa khóa học

    res.json({ message: 'Course and its sections deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse, getCourseById };
