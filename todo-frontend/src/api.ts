import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:8443/api', // This points to your Nginx location /api/
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;