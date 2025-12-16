import { FiPlus } from 'react-icons/fi';

const AddCategoryButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
    >
      <FiPlus className="w-5 h-5" />
      <span>Add New Category</span>
    </button>
  );
};

export default AddCategoryButton;

