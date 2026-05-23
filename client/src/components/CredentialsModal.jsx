import { X, Copy, Check, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { useAdminStore } from '../stores/index.js';

export default function CredentialsModal({ app, onClose }) {
  const { isAuthenticated } = useAdminStore();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showValues, setShowValues] = useState({});

  const handleCopy = async (value, index) => {
    await navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleShow = (index) => {
    setShowValues({ ...showValues, [index]: !showValues[index] });
  };

  const publicCredentials = app.credentials?.filter(c => c.visibility === 'public') || [];
  const privateCredentials = app.credentials?.filter(c => c.visibility === 'private') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-card w-full max-w-md p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">{app.name}</h2>
        <p className="text-sm text-gray-400 mb-6">隐私信息</p>

        {app.credentials?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无隐私信息</p>
        ) : (
          <div className="space-y-4">
            {publicCredentials.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">公开信息</h3>
                <div className="space-y-2">
                  {publicCredentials.map((cred, index) => {
                    const isHidden = cred.isPassword && !showValues[`public_${index}`];
                    return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400">{cred.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-xs text-white truncate max-w-[150px]">
                            {isHidden ? '••••••••' : cred.value}
                          </code>
                          {cred.isPassword && (
                            <button
                              onClick={() => toggleShow(`public_${index}`)}
                              className="p-1 text-gray-500 hover:text-white transition-colors"
                            >
                              {showValues[`public_${index}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(cred.value, `public_${index}`)}
                        className="p-2 text-gray-400 hover:text-accent-primary transition-colors"
                      >
                        {copiedIndex === `public_${index}` ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {privateCredentials.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center space-x-2">
                  <Lock className="w-3 h-3" />
                  <span>私隐信息</span>
                </h3>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {privateCredentials.map((cred, index) => {
                      const isHidden = cred.isPassword && !showValues[`private_${index}`];
                      return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-400">{cred.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <code className="text-xs text-white truncate max-w-[150px]">
                              {isHidden ? '••••••••' : cred.value}
                            </code>
                            {cred.isPassword && (
                              <button
                                onClick={() => toggleShow(`private_${index}`)}
                                className="p-1 text-gray-500 hover:text-white transition-colors"
                              >
                                {showValues[`private_${index}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(cred.value, `private_${index}`)}
                          className="p-2 text-gray-400 hover:text-accent-primary transition-colors"
                        >
                          {copiedIndex === `private_${index}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-400">请先登录管理员账号查看私隐信息</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 btn-secondary"
        >
          关闭
        </button>
      </div>
    </div>
  );
}