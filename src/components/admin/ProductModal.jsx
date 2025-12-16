import { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, product, onSubmit, categories = [] }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!product;

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price || '');
      setCategoryId(product.category_id || product.category?.id || '');
      setStock(product.stock || '');
      setImage(null);
      
      // Get image URL from product (API returns image as relative path like "/storage/products/...")
      let imageUrl = product.image;
      
      // If image URL exists and is relative, prepend base URL
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        // If it starts with /, prepend base URL
        if (imageUrl.startsWith('/')) {
          imageUrl = `http://localhost:8000${imageUrl}`;
        } else {
          // If it's a relative path without leading slash, add /storage/ prefix
          imageUrl = `http://localhost:8000/storage/${imageUrl}`;
        }
      }
      
      setImagePreview(imageUrl || null);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setStock('');
      setImage(null);
      setImagePreview(null);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        id: product?.id,
        name,
        description,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
        stock: parseInt(stock) || 0,
        image: image,
      });
      
      // Reset form and close modal
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setStock('');
      setImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
    setStock('');
    setImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed */}
        <div className="p-8 pb-4 flex-shrink-0 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode ? 'Update product information' : 'Create a new product'}
          </p>
        </div>

        {/* Form - Scrollable */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent resize-none"
                placeholder="Enter product description (optional)"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                placeholder="Enter product price"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Product Image {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      console.error('Image failed to load:', imagePreview);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              {!imagePreview && isEditMode && (
                <div className="mb-3 w-32 h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-400">No image</span>
                </div>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required={!isEditMode}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isEditMode ? 'Leave empty to keep current image' : 'Upload product image'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim() || !price || !categoryId || !stock || (!image && !isEditMode)}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

