import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-0.5">
              <img
                src="/images/logo.png"
                alt="AppHub"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-gray-500">AppHub © 2025 Choice Education. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>using React & Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}