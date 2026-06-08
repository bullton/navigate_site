import { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import CredentialsModal from './CredentialsModal.jsx';

export default function LinksBar() {
  const [links, setLinks] = useState([]);
  const [showCredentials, setShowCredentials] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        if (data.success) {
          setLinks(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch links:', error);
      }
    };
    fetchLinks();
  }, []);

  if (links.length === 0) return null;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3 justify-start">
        {links.map((link) => (
          <div key={link._id} className="flex items-center bg-dark-700/50 rounded-lg px-3 py-1.5">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-300 hover:text-white transition-colors mr-2"
            >
              {link.name}
            </a>
            {link.credentials?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCredentials(link);
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

      {showCredentials && (
        <CredentialsModal
          app={{ ...showCredentials, name: showCredentials.name }}
          onClose={() => setShowCredentials(null)}
        />
      )}
    </>
  );
}