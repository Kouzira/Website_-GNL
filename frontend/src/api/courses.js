import axios from 'axios';

const apiUrl = 'http://localhost:4000/api';

// ----------------- Course API -----------------
// Lấy danh sách khóa học
const getCourses = async () => {
  try {
    const response = await axios.get(`${apiUrl}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Tạo khóa học
const createCourse = async (data) => {
  console.log('Creating course with data:', data);  // Log dữ liệu khóa học trước khi gửi
  try {
    const response = await axios.post(`${apiUrl}/courses`, data);
    console.log('Create course response:', response);  // Log phản hồi từ API
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Cập nhật khóa học
const updateCourse = async (id, data) => {
  try {
    const response = await axios.put(`${apiUrl}/courses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Xóa khóa học
const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// ----------------- Section API -----------------
// Lấy danh sách các section của khóa học
const getSections = async (courseId) => {
  try {
    const response = await axios.get(`${apiUrl}/courses/${courseId}/sections`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
};

// Tạo section mới
const createSection = async (courseId, data) => {
  try {
    const response = await axios.post(`${apiUrl}/courses/${courseId}/sections`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
};

// Cập nhật section
const updateSection = async (sectionId, data) => {
  try {
    const response = await axios.put(`${apiUrl}/sections/${sectionId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating section:', error);
    throw error;
  }
};

// Xóa section
const deleteSection = async (sectionId) => {
  try {
    const response = await axios.delete(`${apiUrl}/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
};

// ----------------- Lecture API -----------------
// Lấy danh sách bài giảng của một section
const getLectures = async (sectionId) => {
  try {
    const response = await axios.get(`${apiUrl}/sections/${sectionId}/lectures`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lectures:', error);
    throw error;
  }
};

// Tạo bài giảng mới
const createLecture = async (sectionId, data) => {
  try {
    const response = await axios.post(`${apiUrl}/sections/${sectionId}/lectures`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating lecture:', error);
    throw error;
  }
};

// Cập nhật bài giảng
const updateLecture = async (lectureId, data) => {
  try {
    const response = await axios.put(`${apiUrl}/lectures/${lectureId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating lecture:', error);
    throw error;
  }
};

// Xóa bài giảng
const deleteLecture = async (lectureId) => {
  try {
    const response = await axios.delete(`${apiUrl}/lectures/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting lecture:', error);
    throw error;
  }
};

export default {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSections,
  createSection,
  updateSection,
  deleteSection,
  getLectures,
  createLecture,
  updateLecture,
  deleteLecture,
};