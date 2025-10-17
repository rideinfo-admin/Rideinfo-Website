import api from './axiosInstance';

// Login function
export const login = async (username, password, user_type) => {
  try {
    const response = await api.post('/auth/login/', {
      username,
      password,
      user_type,
    });
    return response.data; // returns token or user info
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
