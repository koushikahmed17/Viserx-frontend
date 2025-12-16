import { useState, useEffect } from 'react';
import { FiLayout, FiPackage, FiTag } from 'react-icons/fi';

const AdminSidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  // Set active item based on current URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin/dashboard') {
      setActiveItem('dashboard');
    } else if (path === '/admin/category') {
      setActiveItem('categories');
    } else if (path === '/admin/products') {
      setActiveItem('products');
    }
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiLayout,
      path: '/admin/dashboard',
    },
    {
      id: 'products',
      label: 'Products',
      icon: FiPackage,
      path: '/admin/products',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FiTag,
      path: '/admin/category',
    },
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <svg
            className="w-8 h-8 text-teal-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-1 2v8h4v-2h-2V6h-2z" />
          </svg>
          <span className="text-xl font-bold">PickBazar</span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;

