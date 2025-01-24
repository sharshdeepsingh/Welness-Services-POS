import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

export default function Analytics() {
  const { state } = useCart();
  const [allTimeStats, setAllTimeStats] = useState({
    totalRevenue: 0,
    totalServices: 0,
    servicesByCategory: {},
    hotSellingServices: []
  });

  // Calculate current cart stats
  const currentCartRevenue = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const currentCartServices = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const calculateAllTimeStats = () => {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    const stats = {
      totalRevenue: 0,
      totalServices: 0,
      servicesByCategory: {},
      servicesCount: {}
    };

    // Process order history
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        stats.totalRevenue += item.price * item.quantity;
        stats.totalServices += item.quantity;
        stats.servicesByCategory[item.category] = (stats.servicesByCategory[item.category] || 0) + item.quantity;
        stats.servicesCount[item.name] = (stats.servicesCount[item.name] || 0) + item.quantity;
      });
    });

    // Add current cart stats
    stats.totalRevenue += currentCartRevenue;
    stats.totalServices += currentCartServices;
    state.items.forEach(item => {
      stats.servicesByCategory[item.category] = (stats.servicesByCategory[item.category] || 0) + item.quantity;
      stats.servicesCount[item.name] = (stats.servicesCount[item.name] || 0) + item.quantity;
    });

    // Calculate hot selling services
    const hotSellingServices = Object.entries(stats.servicesCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    setAllTimeStats({
      ...stats,
      hotSellingServices
    });
  };

  useEffect(() => {
    calculateAllTimeStats();
  }, [state.items]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-900">₹{allTimeStats.totalRevenue}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Services Sold</h3>
          <p className="text-2xl font-bold text-green-900">{allTimeStats.totalServices}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Hot Selling Services 🔥</h3>
        {allTimeStats.hotSellingServices.map((service, index) => (
          <div key={service.name} className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">
              {index + 1}. {service.name}
            </span>
            <span className="font-semibold">{service.count} sold</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Services by Category</h3>
        {Object.entries(allTimeStats.servicesByCategory).map(([category, count]) => (
          <div key={category} className="flex justify-between items-center py-2">
            <span className="text-gray-700">{category}</span>
            <span className="font-semibold">{count}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <h3 className="text-lg font-semibold mb-2">Current Cart</h3>
        <div className="text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Revenue:</span>
            <span>₹{currentCartRevenue}</span>
          </div>
          <div className="flex justify-between">
            <span>Items:</span>
            <span>{currentCartServices}</span>
          </div>
        </div>
      </div>
    </div>
  );
}