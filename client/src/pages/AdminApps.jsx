import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../stores/index.js';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function AdminApps() {
  const { apps, loading, fetchAdminApps, deleteApp, toggleAppStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAdminApps();
  }, [fetchAdminApps]);

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个应用吗？')) {
      setDeletingId(id);
      await deleteApp(id);
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id) => {
    await toggleAppStatus(id);
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-400';
      case 'maintenance':
        return 'bg-yellow-500/10 text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '未激活';
      case 'maintenance':
        return '维护中';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">应用管理</h1>
          <p className="text-gray-400">管理所有应用，包括添加、编辑和删除</p>
        </div>
        <Link to="/admin/apps/new" className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>添加应用</span>
        </Link>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索应用..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">
                    应用
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">
                    分类
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">
                    状态
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">
                    类型
                  </th>
                  <th className="text-right text-sm font-medium text-gray-400 px-6 py-4">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const Icon = LucideIcons[app.icon] || LucideIcons.AppWindow;
                  return (
                    <tr
                      key={app._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-accent-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {app.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {app.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {app.category?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {getStatusLabel(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {app.featured && (
                            <span className="px-2 py-1 text-xs rounded-full bg-accent-primary/10 text-accent-primary">
                              推荐
                            </span>
                          )}
                          {app.status !== 'inactive' && (
                            <a
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-gray-500 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleStatus(app._id)}
                            className="p-2 text-gray-500 hover:text-white transition-colors"
                            title={app.status === 'active' ? '禁用' : '启用'}
                          >
                            {app.status === 'active' ? (
                              <ToggleRight className="w-5 h-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <Link
                            to={`/admin/apps/${app._id}/edit`}
                            className="p-2 text-gray-500 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(app._id)}
                            disabled={deletingId === app._id}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredApps.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm ? '没有找到匹配的应用' : '暂无应用'}
                </p>
                {!searchTerm && (
                  <Link
                    to="/admin/apps/new"
                    className="inline-flex items-center space-x-2 mt-4 text-sm text-accent-primary hover:text-accent-hover"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加第一个应用</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}