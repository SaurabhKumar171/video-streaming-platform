import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  withCredentials: true, // Required for Cookies
});

export default API;
