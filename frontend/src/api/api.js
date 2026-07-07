import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  getProfile: () => api.get('/profile'),
};

export const attendanceAPI = {
  clockIn: () => api.post('/clock-in'),
  clockOut: () => api.post('/clock-out'),
  getHistory: () => api.get('/attendance/history'),
};

export const adminAPI = {
  getEmployees: () => api.get('/admin/employees'),
  getAttendances: () => api.get('/admin/attendances'),
};

export const systemAPI = {
  healthCheck: () => api.get('/health'),
};

export default api;