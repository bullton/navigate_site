import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ apps, onSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5">
              <img
                src="/images/logo.png"
                alt="AppHub"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">AppHub</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索应用..."
                value={searchValue}
                onChange={handleSearch}
                className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              管理后台
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-card border-t border-white/10">
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索应用..."
                value={searchValue}
                onChange={handleSearch}
                className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50"
              />
            </div>
          </div>
          <div className="px-4 py-3 border-t border-white/10">
            <Link
              to="/admin"
              className="block text-sm text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              管理后台
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}