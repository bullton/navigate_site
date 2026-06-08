import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ExternalLink, Key } from 'lucide-react';
import { useState, useEffect } from 'react';
import CredentialsModal from './CredentialsModal.jsx';

export default function AppCard({ app, index = 0 }) {
  const IconComponent = LucideIcons[app.icon] || LucideIcons.AppWindow;
  const [showCredentials, setShowCredentials] = useState(false);
  const [showLinkCredentials, setShowLinkCredentials] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch(`/api/links/app/${app._id}`);
        const data = await res.json();
        if (data.success) {
          setLinks(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch links:', error);
      }
    };
    fetchLinks();
  }, [app._id]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-inactive';
    }
  };

  const hasCredentials = app.credentials?.length > 0;

  return (
    <>
      <div
        className="glass-card-hover block p-6 animate-stagger"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-accent-primary" />
          </div>
          <div className="flex items-center space-x-2">
            {app.featured && (
              <span className="px-2 py-0.5 text-xs font-medium bg-accent-primary/20 text-accent-primary rounded-full">
                推荐
              </span>
            )}
            <span className={getStatusClass(app.status)} />
          </div>
        </div>

        <Link
          to={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="text-lg font-semibold text-white mb-2">{app.name}</h3>

          {app.description && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {app.description}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          {app.category && (
            <span className="text-xs text-gray-500">
              {app.category.name}
            </span>
          )}
          <div className="flex items-center space-x-2">
            {hasCredentials && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCredentials(true);
                }}
                className="p-2 text-gray-500 hover:text-accent-primary transition-colors rounded-lg hover:bg-white/5"
                title="查看隐私信息"
              >
                <Key className="w-4 h-4" />
              </button>
            )}
            <Link
              to={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {showCredentials && (
        <CredentialsModal
          app={app}
          onClose={() => setShowCredentials(false)}
        />
      )}

      {showLinkCredentials && (
        <CredentialsModal
          app={{ ...showLinkCredentials, name: showLinkCredentials.name }}
          onClose={() => setShowLinkCredentials(null)}
        />
      )}

      {links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {links.map((link) => (
            <div key={link._id} className="flex items-center bg-dark-700/50 rounded-lg px-2 py-1">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-300 hover:text-white transition-colors mr-2"
              >
                {link.name}
              </a>
              {link.credentials?.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLinkCredentials(link);
                  }}
                  className="p-1 text-gray-500 hover:text-accent-primary transition-colors"
                  title="查看隐私信息"
                >
                  <Key className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}