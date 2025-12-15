import { useState } from 'react';
import CategorySidebar from '../components/CategorySidebar';
import ProductsGrid from '../components/ProductsGrid';
import { products } from '../data/products';
import { categories } from '../data/categories';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to first category

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => {
        const category = categories.find((cat) => cat.id === selectedCategory);
        return product.category === category?.name;
      })
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
        <ProductsGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ProductsPage;

