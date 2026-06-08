import { useEffect, useState } from 'react';
import { useAdminStore } from '../stores/index.js';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';

export default function AdminLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    status: 'active',
    credentials: []
  });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/links', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingLink 
      ? `/api/admin/links/${editingLink._id}`
      : '/api/admin/links';
    
    const res = await fetch(url, {
      method: editingLink ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      fetchLinks();
      setShowModal(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个链接吗？')) {
      setDeletingId(id);
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/admin/links/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLinks();
      setDeletingId(null);
    }
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      status: link.status,
      credentials: link.credentials || []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingLink(null);
    setFormData({ name: '', url: '', status: 'active', credentials: [] });
  };

  const addCredential = () => {
    setFormData({
      ...formData,
      credentials: [...formData.credentials, { name: '', value: '', visibility: 'private' }]
    });
  };

  const updateCredential = (index, field, value) => {
    const newCreds = [...formData.credentials];
    newCreds[index][field] = value;
    setFormData({ ...formData, credentials: newCreds });
  };

  const removeCredential = (index) => {
    setFormData({
      ...formData,
      credentials: formData.credentials.filter((_, i) => i !== index)
    });
  };

  const filteredLinks = links.filter(
    (link) => link.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">链接管理</h1>
          <p className="text-gray-400">管理第三方外链信息</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>添加链接</span>
        </button>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索链接..."
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
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">链接名称</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">状态</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">隐私信息</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-6 py-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => (
                  <tr key={link._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-medium text-white">{link.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        link.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {link.status === 'active' ? '活跃' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {link.credentials?.length || 0} 条
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        {link.status !== 'inactive' && (
                          <a href={link.url} target="_blank" rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-white transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => openEditModal(link)}
                          className="p-2 text-gray-500 hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(link._id)} disabled={deletingId === link._id}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLinks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{searchTerm ? '没有找到匹配的链接' : '暂无链接'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card w-full max-w-md p-6 m-4">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingLink ? '编辑链接' : '添加链接'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">链接名称</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field" placeholder="例如：ChatGPT" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">链接地址</label>
                <input type="url" required value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">状态</label>
                <select value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field">
                  <option value="active">活跃</option>
                  <option value="inactive">禁用</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">隐私信息</label>
                  <button type="button" onClick={addCredential}
                    className="text-xs text-accent-primary hover:text-accent-hover">
                    + 添加
                  </button>
                </div>
                {formData.credentials.map((cred, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" placeholder="名称"
                      value={cred.name}
                      onChange={(e) => updateCredential(index, 'name', e.target.value)}
                      className="input-field flex-1" />
                    <input type="text" placeholder="值"
                      value={cred.value}
                      onChange={(e) => updateCredential(index, 'value', e.target.value)}
                      className="input-field flex-1" />
                    <button type="button" onClick={() => removeCredential(index)}
                      className="text-gray-500 hover:text-red-400 px-2">
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  className="btn-secondary">取消</button>
                <button type="submit" className="btn-primary">
                  {editingLink ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}