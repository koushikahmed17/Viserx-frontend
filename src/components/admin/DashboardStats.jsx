import { FiUsers, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const DashboardStats = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Users',
      value: '1,234',
      change: '+12.5%',
      icon: FiUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'Total Products',
      value: '567',
      change: '+8.2%',
      icon: FiPackage,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 3,
      title: 'Total Revenue',
      value: '$45,678',
      change: '+15.3%',
      icon: FiDollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      id: 4,
      title: 'Growth Rate',
      value: '23.5%',
      change: '+5.1%',
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;

