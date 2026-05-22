import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAdminStore } from '../stores/index.js';

const ICON_OPTIONS = [
  'AppWindow', 'Bot', 'Code', 'FileCode', 'Layers', 'Sparkles',
  'Terminal', 'Globe', 'Database', 'Cloud', 'Settings', 'Palette',
  'Camera', 'Video', 'Music', 'Image', 'FileText', 'Mail',
  'MessageSquare', 'Calendar', 'Clock', 'Star', 'Heart', 'Bookmark'
];

const STATUS_OPTIONS = [
  { value: 'active', label: '活跃' },
  { value: 'inactive', label: '未激活' },
  { value: 'maintenance', label: '维护中' }
];

export default function AppForm({ app = null }) {
  const navigate = useNavigate();
  const { categories, fetchAdminCategories, createApp, updateApp } = useAdminStore();
  const isEditing = !!app;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    url: '',
    icon: 'AppWindow',
    category: '',
    tags: '',
    status: 'active',
    featured: false,
    sortOrder: 0
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAdminCategories();
  }, [fetchAdminCategories]);

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name || '',
        slug: app.slug || '',
        description: app.description || '',
        url: app.url || '',
        icon: app.icon || 'AppWindow',
        category: app.category?._id || '',
        tags: app.tags?.join(', ') || '',
        status: app.status || 'active',
        featured: app.featured || false,
        sortOrder: app.sortOrder || 0
      });
    }
  }, [app]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const submitData = {
      ...formData,
      category: formData.category || null,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []
    };

    const result = isEditing
      ? await updateApp(app._id, submitData)
      : await createApp(submitData);

    setSaving(false);

    if (result.success) {
      setMessage({ type: 'success', text: isEditing ? '应用更新成功' : '应用创建成功' });
      setTimeout(() => navigate('/admin/apps'), 1000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/apps')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回列表</span>
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? '编辑应用' : '创建应用'}
        </h1>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              应用名称 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="例如：ChatGPT"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="input-field"
              placeholder="chatgpt"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              分类
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">无分类</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              访问地址 *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://chat.openai.com"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              描述
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="简短描述应用功能..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              图标
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((iconName) => {
                const Icon = LucideIcons[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.icon === iconName
                        ? 'border-accent-primary bg-accent-primary/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              标签
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="AI, 聊天, GPT (用逗号分隔)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              状态
            </label>
            <div className="flex space-x-4">
              {STATUS_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={formData.status === option.value}
                    onChange={handleChange}
                    className="w-4 h-4 text-accent-primary"
                  />
                  <span className="text-sm text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              排序
            </label>
            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              className="input-field"
              min="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded text-accent-primary"
              />
              <span className="text-sm text-gray-300">
                设为推荐应用（将在首页优先展示）
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/apps')}
            className="btn-secondary"
          >
            取消
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? '保存更改' : '创建应用'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}