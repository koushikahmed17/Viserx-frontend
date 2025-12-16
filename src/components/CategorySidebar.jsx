import { useState, useEffect } from 'react';
import { getCategories } from '../utils/api';

const CategorySidebar = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: apiError } = await getCategories();
      if (apiError) {
        setError(apiError);
        setCategories([]);
      } else {
        // API returns: { success: true, data: [...] }
        const categoriesList = data?.data || [];
        setCategories(Array.isArray(categoriesList) ? categoriesList : []);
      }
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Default icon mapping (you can customize this)
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Fruits & Vegetables': '🥬',
      'Meat & Fish': '🥩',
      'Snacks': '🍿',
      'Pet Care': '🐾',
      'Home & Cleaning': '🧹',
      'Dairy': '🥛',
      'Cooking': '🍳',
      'Breakfast': '🥐',
      'Beverage': '🥤',
      'Electronics': '📱',
      'Phone': '📱',
      'Laptop': '💻',
    };
    return iconMap[categoryName] || '📦'; // Default icon
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchCategories}
            className="mt-2 text-teal-600 text-sm hover:underline"
          >
            Retry
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No categories found</p>
        </div>
      ) : (
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
              <span className="text-2xl">{getCategoryIcon(category.name)}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;



