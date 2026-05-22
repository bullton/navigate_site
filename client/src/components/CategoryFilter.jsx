import { Folder } from 'lucide-react';

export default function CategoryFilter({ categories, selectedCategory, onSelect }) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
          selectedCategory === null
            ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/25'
            : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
        }`}
      >
        全部
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelect(category.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
            selectedCategory === category.slug
              ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/25'
              : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}