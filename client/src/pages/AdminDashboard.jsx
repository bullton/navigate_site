import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../stores/index.js';
import { AppWindow, Layers, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { stats, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      label: '应用总数',
      value: stats?.totalApps || 0,
      icon: AppWindow,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: '活跃应用',
      value: stats?.activeApps || 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: '分类总数',
      value: stats?.categories || 0,
      icon: Layers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: '最近添加',
      value: stats?.recentApps?.length || 0,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">仪表板</h1>
        <p className="text-gray-400">欢迎回来，这里是你的应用概览</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">最近添加的应用</h2>
          <Link
            to="/admin/apps"
            className="flex items-center space-x-1 text-sm text-accent-primary hover:text-accent-hover transition-colors"
          >
            <span>查看全部</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentApps?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentApps.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                    <AppWindow className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{app.name}</p>
                    <p className="text-xs text-gray-500">{app.url}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'active'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {app.status === 'active' ? '活跃' : '未激活'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">暂无应用</p>
            <Link
              to="/admin/apps/new"
              className="inline-flex items-center space-x-2 mt-4 text-sm text-accent-primary hover:text-accent-hover"
            >
              <span>添加第一个应用</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}