import { FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product, onAddToCart }) => {
  // Convert price string to number for display
  const price = product.price ? parseFloat(product.price) : 0;
  
  // Handle image URL - convert relative path to full URL
  const getImageUrl = () => {
    if (!product.image) {
      return 'https://via.placeholder.com/400x400?text=Product';
    }
    if (product.image.startsWith('http') || product.image.startsWith('data:')) {
      return product.image;
    }
    // Relative path like "/storage/products/..."
    return `http://localhost:8000${product.image}`;
  };

  // Get category name from nested category object or fallback
  const categoryName = product.category?.name || 'Uncategorized';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Discount Badge - only show if discount exists */}
      {product.discount && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded z-10">
          {product.discount}%
        </div>
      )}

      {/* Product Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-1">{categoryName}</p>
        {product.description && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2 mb-4">
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${parseFloat(product.originalPrice).toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-teal-600">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Stock info */}
        {product.stock !== undefined && (
          <p className="text-xs text-gray-500 mb-2">
            Stock: {product.stock}
          </p>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
        >
          <FiShoppingCart className="w-5 h-5" />
          <span>Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;



