import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProductList = ({ products, onEdit, onDelete }) => {
  // Ensure products is always an array
  const productsArray = Array.isArray(products) ? products : [];
  
  if (productsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {productsArray.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          {/* Product Info */}
          <div className="flex items-center space-x-3">
            {product.image && (
              <img
                src={product.image.startsWith('http') || product.image.startsWith('data:') 
                  ? product.image 
                  : `http://localhost:8000${product.image}`}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div>
              <span className="text-lg font-medium text-gray-900">{product.name}</span>
              <p className="text-sm text-gray-500">
                Price: ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'} | Stock: {product.stock}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit product"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete product"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

