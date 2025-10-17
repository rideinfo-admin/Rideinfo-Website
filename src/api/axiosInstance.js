import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://ri-backend-247c.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Correctly export the login function
export async function login(username, password, user_type) {
  try {
    const response = await api.post("/auth/login/", {
      username,
      password,
      user_type,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
}

// Also export the axios instance (optional)
export default api;
