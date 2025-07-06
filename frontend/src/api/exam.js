import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export const fetchExamQuestions = () => {
  return axios.get(`${API_BASE_URL}/exam/questions`);
};

export const saveExamResult = (resultData) => {
  return axios.post(`${API_BASE_URL}/exam/result`, resultData);
};

export const getExamResults = (userId) => {
  return axios.get(`${API_BASE_URL}/exam/results`, { params: { userId } });
};