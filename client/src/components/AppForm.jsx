import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
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
    sortOrder: 0,
    credentials: []
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswords, setShowPasswords] = useState({});

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
        sortOrder: app.sortOrder || 0,
        credentials: app.credentials || []
      });
    }
  }, [app]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === 'checkbox' ? checked : value;
    
    if (name === 'name' && !isEditing) {
      const slug = value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setFormData({ ...formData, name: value, slug });
    } else {
      setFormData({ ...formData, [name]: processedValue });
    }
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
        : [],
      credentials: formData.credentials || []
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

  const addCredential = () => {
    setFormData({
      ...formData,
      credentials: [
        ...formData.credentials,
        { name: '', value: '', visibility: 'public', order: formData.credentials.length }
      ]
    });
  };

  const updateCredential = (index, field, value) => {
    const newCredentials = [...formData.credentials];
    newCredentials[index][field] = value;
    setFormData({ ...formData, credentials: newCredentials });
  };

  const removeCredential = (index) => {
    setFormData({
      ...formData,
      credentials: formData.credentials.filter((_, i) => i !== index)
    });
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
              pattern="[a-z0-9-]+"
              title="小写字母、数字和连字符"
              required
            />
            <p className="text-xs text-gray-500 mt-1">用于 URL，只能包含小写字母、数字和连字符</p>
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

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">隐私信息</h3>
            <button
              type="button"
              onClick={addCredential}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-accent-primary/10 text-accent-primary rounded-lg hover:bg-accent-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>添加字段</span>
            </button>
          </div>

          {formData.credentials.length === 0 ? (
            <p className="text-sm text-gray-500">暂无隐私信息，点击上方按钮添加</p>
          ) : (
            <div className="space-y-3">
              {formData.credentials.map((cred, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="flex flex-col space-y-1 flex-1">
                    <input
                      list={`cred-name-list-${index}`}
                      type="text"
                      placeholder="字段名称（如：API Key、密码）"
                      value={cred.name}
                      onChange={(e) => updateCredential(index, 'name', e.target.value)}
                      className="input-field text-sm"
                    />
                    <datalist id={`cred-name-list-${index}`}>
                      <option value="用户名" />
                      <option value="密码" />
                      <option value="Token" />
                      <option value="API Key" />
                      <option value="Secret Key" />
                      <option value="Access Token" />
                      <option value="API Secret" />
                      <option value="Bearer Token" />
                      <option value="Client ID" />
                      <option value="Client Secret" />
                    </datalist>
                    <div className="flex items-center space-x-2">
                      <input
                        type={showPasswords[index] ? 'text' : 'password'}
                        placeholder="字段值"
                        value={cred.value}
                        onChange={(e) => updateCredential(index, 'value', e.target.value)}
                        className="input-field text-sm flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, [index]: !showPasswords[index] })}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords[index] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={cred.visibility === 'public'}
                          onChange={() => updateCredential(index, 'visibility', 'public')}
                          className="w-4 h-4 text-accent-primary"
                        />
                        <span className="text-sm text-gray-400">公开</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={cred.visibility === 'private'}
                          onChange={() => updateCredential(index, 'visibility', 'private')}
                          className="w-4 h-4 text-accent-primary"
                        />
                        <span className="text-sm text-gray-400">私隐（仅管理员可见）</span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCredential(index)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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