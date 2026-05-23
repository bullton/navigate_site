import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LayoutDashboard, AppWindow, FolderOpen, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore, useAdminStore } from '../stores/index.js';

const navItems = [
  { path: '/admin/dashboard', label: '仪表板', icon: LayoutDashboard },
  { path: '/admin/apps', label: '应用管理', icon: AppWindow },
  { path: '/admin/categories', label: '分类管理', icon: FolderOpen },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const { setAuthenticated } = useAdminStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('adminToken')) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    navigate('/admin');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-dark-900">
      <aside className="w-64 bg-dark-800 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-white">AppHub</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">管理后台</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-accent-primary text-white'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-white hover:bg-dark-700 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-dark-900">
        <header className="bg-dark-800 border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-white transition-colors">
                首页
              </Link>
              {navItems.map((item) => {
                if (isActive(item.path)) {
                  return (
                    <div key={item.path} className="flex items-center space-x-2">
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-white">{item.label}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}