import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ExternalLink } from 'lucide-react';

export default function AppCard({ app, index = 0 }) {
  const IconComponent = LucideIcons[app.icon] || LucideIcons.AppWindow;

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

  return (
    <Link
      to={app.url}
      target="_blank"
      rel="noopener noreferrer"
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

      <h3 className="text-lg font-semibold text-white mb-2">{app.name}</h3>

      {app.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {app.description}
        </p>
      )}

      {app.category && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {app.category.name}
          </span>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </Link>
  );
}