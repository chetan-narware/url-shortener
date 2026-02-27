import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // your backend runs on 3000
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem("token");

      // Optional: redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;