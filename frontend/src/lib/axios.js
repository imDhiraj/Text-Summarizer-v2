import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    "https://text-summarizer-v2-hcogprguf-imdhirajs-projects.vercel.app/api/v1", // This should match your backend
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});