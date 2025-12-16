import { useState, useEffect } from 'react';
import CategorySidebar from '../components/CategorySidebar';
import ProductsGrid from '../components/ProductsGrid';
import { getProducts } from '../utils/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // null means show all
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: apiError } = await getProducts();
      if (apiError) {
        setError(apiError);
        setProducts([]);
      } else {
        // API returns: { success: true, data: [...] }
        const productsList = data?.data || [];
        setProducts(Array.isArray(productsList) ? productsList : []);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory)
    : products;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = (product) => {
    // TODO: Implement cart functionality
    console.log('Added to cart:', product);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <CategorySidebar
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {selectedCategory ? 'No products found in this category.' : 'No products available.'}
            </p>
          </div>
        ) : (
          <ProductsGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;



