import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const registerUser = async (email: string, password: string) => {
  return axios.post(`${API_BASE_URL}/auth/register`, { email, password });
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data.token;
};

export const getUserStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3001/api/user/stats', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};