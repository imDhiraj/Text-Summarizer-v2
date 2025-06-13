import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8080/api/v1", // This should match your backend
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});