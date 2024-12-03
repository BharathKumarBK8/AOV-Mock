// Api.js
import axios from 'axios';

export const SERVER_URL = 'http://localhost:3004';

// Create and export the base axios instance
export const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


