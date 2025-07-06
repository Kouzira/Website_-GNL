import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/questions';

export const uploadQuestionsAPI = (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getQuestionsAPI = () => {
  return axios.get(BASE_URL);
};

export const createQuestionAPI = (questionData) => {
  return axios.post(BASE_URL, questionData);
};

export const updateQuestionAPI = (id, questionData) => {
  return axios.put(`${BASE_URL}/${id}`, questionData);
};

export const deleteQuestionAPI = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

export const deleteAllQuestionsAPI = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await axios.delete(`${BASE_URL}/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Delete all questions error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error('Authentication required');
    } else if (error.response?.status === 403) {
      throw new Error('Admin access required');
    }
    throw new Error(error.response?.data?.message || 'Failed to delete all questions');
  }
};
