import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

export const publicAPI = {
  getApps: () => api.get('/apps'),
  getAppBySlug: (slug) => api.get(`/apps/${slug}`),
  getFeaturedApps: () => api.get('/apps/featured'),
  getCategories: () => api.get('/categories'),
};

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getMe: () => api.get('/admin/me'),
  getStats: () => api.get('/admin/stats'),

  getApps: () => api.get('/admin/apps'),
  createApp: (data) => api.post('/admin/apps', data),
  updateApp: (id, data) => api.put(`/admin/apps/${id}`, data),
  deleteApp: (id) => api.delete(`/admin/apps/${id}`),
  toggleAppStatus: (id) => api.patch(`/admin/apps/${id}/toggle-status`),

  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export default api;