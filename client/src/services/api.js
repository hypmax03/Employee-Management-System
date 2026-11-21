import axios from 'axios';

// Base API URL with fallback to local backend port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Attach JWT token to every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apex_ems_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors like 401 (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired, clear stored auth data
      localStorage.removeItem('apex_ems_token');
      localStorage.removeItem('apex_ems_user');
      // If not on login or register, redirect to login
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API services
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

// Employee API services
export const employeeService = {
  getAll: async (params = {}) => {
    const res = await api.get('/employees', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/employees/${id}`);
    return res.data;
  },
  create: async (employeeData) => {
    const res = await api.post('/employees', employeeData);
    return res.data;
  },
  update: async (id, employeeData) => {
    const res = await api.put(`/employees/${id}`, employeeData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/employees/${id}`);
    return res.data;
  }
};

export default api;
