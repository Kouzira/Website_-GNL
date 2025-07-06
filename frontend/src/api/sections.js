import axios from 'axios';

const API_URL = 'http://localhost:4000/api/sections'; // Địa chỉ backend

const token = localStorage.getItem('token'); // Lấy token từ localStorage hoặc state

const config = {
  headers: {
    Authorization: `Bearer ${token}`, // Gửi token trong header
  },
};

// Tạo một section mới
export const createSection = async (sectionData) => {
  try {
    const response = await axios.post(API_URL, sectionData, config);
    return response.data;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

// Cập nhật một section
export const updateSection = async (sectionId, sectionData) => {
  try {
    const response = await axios.put(`${API_URL}/${sectionId}`, sectionData, config);
    return response.data;
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};

// Xóa một section
export const deleteSection = async (sectionId) => {
  try {
    const response = await axios.delete(`${API_URL}/${sectionId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
};

// Lấy tất cả các section
export const getSections = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error;
  }
};

// Lấy thông tin chi tiết một section theo ID
export const getSectionById = async (sectionId) => {
  try {
    const response = await axios.get(`${API_URL}/${sectionId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching section by ID:", error);
    throw error;
  }
};
