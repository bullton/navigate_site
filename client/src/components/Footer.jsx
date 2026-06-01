import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.jpeg"
              alt="AppHub"
              className="h-6 w-auto"
            />
            <span className="text-sm text-gray-500">AppHub</span>
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