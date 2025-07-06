import axios from 'axios';

const API_URL = 'http://localhost:4000/api/lectures'; // Địa chỉ backend

const token = localStorage.getItem('token'); // Lấy token từ localStorage hoặc state

const config = {
  headers: {
    Authorization: `Bearer ${token}`, // Gửi token trong header
  },
};

// Tạo một lecture mới
export const createLecture = async (lectureData) => {
  try {
    const response = await axios.post(API_URL, lectureData, config);
    return response.data;
  } catch (error) {
    console.error("Error creating lecture:", error);
    throw error;
  }
};

// Cập nhật một lecture
export const updateLecture = async (lectureId, lectureData) => {
  try {
    const response = await axios.put(`${API_URL}/${lectureId}`, lectureData, config);
    return response.data;
  } catch (error) {
    console.error("Error updating lecture:", error);
    throw error;
  }
};

// Xóa một lecture
export const deleteLecture = async (lectureId) => {
  try {
    const response = await axios.delete(`${API_URL}/${lectureId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting lecture:", error);
    throw error;
  }
};

// Lấy tất cả các lecture
export const getLectures = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw error;
  }
};

// Lấy thông tin chi tiết một lecture theo ID
export const getLectureById = async (lectureId) => {
  try {
    const response = await axios.get(`${API_URL}/${lectureId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching lecture by ID:", error);
    throw error;
  }
};
