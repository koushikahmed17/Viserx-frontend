import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  // Ensure categories is always an array
  const categoriesArray = Array.isArray(categories) ? categories : [];
  
  if (categoriesArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories found. Add your first category!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categoriesArray.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          {/* Category Name */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{category.icon}</span>
            <span className="text-lg font-medium text-gray-900">{category.name}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit category"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete category"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;

