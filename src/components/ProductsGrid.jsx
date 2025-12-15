import ProductCard from './ProductCard';

const ProductsGrid = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;

