import { create } from 'zustand';
import { publicAPI, adminAPI } from '../api/index.js';

export const useAppStore = create((set, get) => ({
  apps: [],
  categories: [],
  featuredApps: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  fetchApps: async () => {
    set({ loading: true, error: null });
    try {
      const res = await publicAPI.getApps();
      set({ apps: res.data.data, loading: false });
    } catch (error) {
      set({ error: '获取应用列表失败', loading: false });
    }
  },

  fetchFeaturedApps: async () => {
    try {
      const res = await publicAPI.getFeaturedApps();
      set({ featuredApps: res.data.data });
    } catch (error) {
      console.error('获取推荐应用失败', error);
    }
  },

  fetchCategories: async () => {
    try {
      const res = await publicAPI.getCategories();
      set({ categories: res.data.data });
    } catch (error) {
      console.error('获取分类列表失败', error);
    }
  },

  getFilteredApps: () => {
    const { apps, searchQuery, selectedCategory } = get();
    let filtered = apps;

    if (selectedCategory) {
      filtered = filtered.filter(
        (app) => app.category?.slug === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description?.toLowerCase().includes(query) ||
          app.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  },
}));

export const useAuthStore = create((set) => ({
  admin: null,
  token: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await adminAPI.login(credentials);
      const { token, admin } = res.data.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminInfo', JSON.stringify(admin));
      set({ admin, token, isAuthenticated: true, loading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || '登录失败';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await adminAPI.logout();
    } catch (error) {
      console.error('登出请求失败', error);
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    set({ admin: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      set({ isAuthenticated: false });
      return false;
    }

    try {
      const res = await adminAPI.getMe();
      set({ admin: res.data.data, isAuthenticated: true });
      return true;
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      set({ isAuthenticated: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export const useAdminStore = create((set, get) => ({
  apps: [],
  categories: [],
  stats: null,
  loading: false,
  error: null,

  fetchAdminApps: async () => {
    set({ loading: true, error: null });
    try {
      const res = await adminAPI.getApps();
      set({ apps: res.data.data, loading: false });
    } catch (error) {
      set({ error: '获取应用列表失败', loading: false });
    }
  },

  fetchAdminCategories: async () => {
    try {
      const res = await adminAPI.getCategories();
      set({ categories: res.data.data });
    } catch (error) {
      console.error('获取分类列表失败', error);
    }
  },

  fetchStats: async () => {
    try {
      const res = await adminAPI.getStats();
      set({ stats: res.data.data });
    } catch (error) {
      console.error('获取统计数据失败', error);
    }
  },

  createApp: async (data) => {
    try {
      const res = await adminAPI.createApp(data);
      const { apps } = get();
      set({ apps: [res.data.data, ...apps] });
      return { success: true, data: res.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '创建应用失败',
      };
    }
  },

  updateApp: async (id, data) => {
    try {
      const res = await adminAPI.updateApp(id, data);
      const { apps } = get();
      set({
        apps: apps.map((app) =>
          app._id === id ? res.data.data : app
        ),
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '更新应用失败',
      };
    }
  },

  deleteApp: async (id) => {
    try {
      await adminAPI.deleteApp(id);
      const { apps } = get();
      set({ apps: apps.filter((app) => app._id !== id) });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '删除应用失败',
      };
    }
  },

  toggleAppStatus: async (id) => {
    try {
      const res = await adminAPI.toggleAppStatus(id);
      const { apps } = get();
      set({
        apps: apps.map((app) =>
          app._id === id ? res.data.data : app
        ),
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '更新状态失败',
      };
    }
  },

  createCategory: async (data) => {
    try {
      const res = await adminAPI.createCategory(data);
      const { categories } = get();
      set({ categories: [...categories, res.data.data] });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '创建分类失败',
      };
    }
  },

  updateCategory: async (id, data) => {
    try {
      const res = await adminAPI.updateCategory(id, data);
      const { categories } = get();
      set({
        categories: categories.map((cat) =>
          cat._id === id ? res.data.data : cat
        ),
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '更新分类失败',
      };
    }
  },

  deleteCategory: async (id) => {
    try {
      await adminAPI.deleteCategory(id);
      const { categories } = get();
      set({ categories: categories.filter((cat) => cat._id !== id) });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '删除分类失败',
      };
    }
  },
}));