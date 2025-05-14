import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_NODE_URL || "http://localhost:3000",
  timeout: 3600,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
