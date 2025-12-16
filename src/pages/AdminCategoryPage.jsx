import { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import CategoryList from '../components/admin/CategoryList';
import AddCategoryButton from '../components/admin/AddCategoryButton';
import CategoryModal from '../components/admin/CategoryModal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../utils/api';

const AdminCategoryPage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories on component mount
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
        setCategoryList([]); // Set empty array on error
      } else {
        // API returns: { success: true, data: [...] }
        const categories = data?.data || [];
        setCategoryList(Array.isArray(categories) ? categories : []);
      }
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
      setCategoryList([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const { error: apiError } = await deleteCategory(categoryId);
        if (apiError) {
          alert(`Failed to delete category: ${apiError}`);
        } else {
          // Remove from list
          setCategoryList(categoryList.filter((cat) => cat.id !== categoryId));
        }
      } catch (err) {
        alert('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleSubmitCategory = async (categoryData) => {
    try {
      if (categoryData.id) {
        // Update existing category
        const { data, error: apiError } = await updateCategory(categoryData.id, {
          name: categoryData.name,
          description: categoryData.description,
        });

        if (apiError) {
          alert(`Failed to update category: ${apiError}`);
          return;
        }

        // Update in list - API returns: { success: true, data: { category object } }
        const updatedCategory = data?.data || data?.category || data || categoryData;
        setCategoryList(
          categoryList.map((cat) =>
            cat.id === categoryData.id ? { ...cat, ...updatedCategory } : cat
          )
        );
        setIsModalOpen(false);
      } else {
        // Create new category
        const { data, error: apiError } = await createCategory({
          name: categoryData.name,
          description: categoryData.description,
        });

        if (apiError) {
          alert(`Failed to create category: ${apiError}`);
          return;
        }

        // Add to list - API returns: { success: true, data: { category object } }
        const newCategory = data?.data || data?.category || data;
        if (newCategory) {
          setCategoryList([...categoryList, newCategory]);
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      alert('Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Category Content */}
        <main className="mt-20 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>

          {/* Add Category Button */}
          <div className="mb-6">
            <AddCategoryButton onClick={handleAddCategory} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Category List */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading categories...</p>
              </div>
            ) : (
              <CategoryList
                categories={categoryList}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            )}
          </div>
        </main>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
};

export default AdminCategoryPage;

