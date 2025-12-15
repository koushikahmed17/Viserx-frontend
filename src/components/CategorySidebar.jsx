import { categories } from '../data/categories';

const CategorySidebar = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-teal-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;

