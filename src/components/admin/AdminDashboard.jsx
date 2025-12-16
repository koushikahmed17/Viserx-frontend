import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import DashboardStats from './DashboardStats';

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Dashboard Content */}
        <main className="mt-20 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Overview
            </h2>
            <p className="text-gray-600">
              Welcome to your admin dashboard. Here's what's happening today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Additional Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Orders
              </h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div
                    key={order}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{1000 + order}
                      </p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Products
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Fresh Apples', sales: 234, revenue: '$1,234' },
                  { name: 'Baby Spinach', sales: 189, revenue: '$945' },
                  { name: 'Blueberries', sales: 156, revenue: '$780' },
                  { name: 'Organic Milk', sales: 142, revenue: '$710' },
                  { name: 'Fresh Salmon', sales: 128, revenue: '$1,280' },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.sales} sales
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {product.revenue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

