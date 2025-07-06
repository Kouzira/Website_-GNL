// src/api/result.js
import axios from 'axios';

export const fetchTopResults = () => axios.get('http://localhost:4000/api/results/top');

// Lấy kết quả thi của người dùng
export const fetchExamResults = (userId) => {
  return axios.get(`http://localhost:4000/api/exam/results`, { params: { userId } });
};
