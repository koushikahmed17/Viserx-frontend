import { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import ProductList from '../components/admin/ProductList';
import AddProductButton from '../components/admin/AddProductButton';
import ProductModal from '../components/admin/ProductModal';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../utils/api';

const AdminProductPage = () => {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: apiError } = await getProducts();
      if (apiError) {
        setError(apiError);
        setProductList([]);
      } else {
        // API returns: { success: true, data: [...] }
        const products = data?.data || [];
        setProductList(Array.isArray(products) ? products : []);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
      setProductList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error: apiError } = await getCategories();
      if (!apiError && data?.data) {
        setCategories(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const { data, error: apiError } = await deleteProduct(productId);
        if (apiError) {
          alert(`Failed to delete product: ${apiError}`);
        } else {
          // Remove from list
          setProductList(productList.filter((prod) => prod.id !== productId));
          console.log('Product deleted successfully:', productId);
        }
      } catch (err) {
        alert('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleSubmitProduct = async (productData) => {
    try {
      if (productData.id) {
        // Update existing product
        const { data, error: apiError } = await updateProduct(productData.id, {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id,
          stock: productData.stock,
          image: productData.image,
        });

        if (apiError) {
          alert(`Failed to update product: ${apiError}`);
          return;
        }

        // Update in list - API returns: { success: true, data: { product object } }
        const updatedProduct = data?.data || data?.product || data || productData;
        setProductList(
          productList.map((prod) =>
            prod.id === productData.id ? { ...prod, ...updatedProduct } : prod
          )
        );
        setIsModalOpen(false);
      } else {
        // Create new product
        const { data, error: apiError } = await createProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id,
          stock: productData.stock,
          image: productData.image,
        });

        if (apiError) {
          alert(`Failed to create product: ${apiError}`);
          return;
        }

        // Add to list - API returns: { success: true, data: { product object } }
        const newProduct = data?.data || data?.product || data;
        if (newProduct) {
          setProductList([...productList, newProduct]);
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      alert('Failed to save product');
      console.error('Error saving product:', err);
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

        {/* Product Content */}
        <main className="mt-20 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Manage your products</p>
          </div>

          {/* Add Product Button */}
          <div className="mb-6">
            <AddProductButton onClick={handleAddProduct} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Product List */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : (
              <ProductList
                products={productList}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleSubmitProduct}
      />
    </div>
  );
};

export default AdminProductPage;

