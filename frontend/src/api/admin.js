import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/admin';

// Get all users with pagination and search
export const fetchUsers = async (page = 1, limit = 10, search = '') => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: { page, limit, search },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  const token = localStorage.getItem('accessToken');
  console.log('Creating user with token:', token);
  try {
    const response = await axios.post(`${BASE_URL}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Create user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  const token = localStorage.getItem('accessToken');
  console.log('Updating user with token:', token);
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Update user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response?.data || error.message);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  const token = localStorage.getItem('accessToken');
  console.log('Deleting user with token:', token);
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Delete user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response?.data || error.message);
    throw error;
  }
}; 