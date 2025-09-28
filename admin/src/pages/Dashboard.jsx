import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, ShoppingCart, DollarSign, TrendingUp, Package, Eye } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    activeOrders: [],
    revenueData: [],
    profitData: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard API Error:', err);
      setError('Failed to fetch dashboard data');

      // Optional: fallback mock data for development
      const useMock = true;
      if (useMock) {
        setDashboardData({
          totalUsers: 1247,
          totalOrders: 892,
          totalRevenue: 156780,
          totalProfit: 47034,
          activeOrders: [
            {
              _id: 'ORD001',
              customerName: 'Rajesh Kumar',
              items: [{ name: 'Brass Diya Set', quantity: 2 }],
              totalAmount: 1250,
              status: 'Processing',
              createdAt: '2025-08-29T10:30:00Z'
            }
          ],
          revenueData: [
            { name: 'Jan', revenue: 12000, profit: 3600 },
            { name: 'Feb', revenue: 15000, profit: 4500 },
            { name: 'Mar', revenue: 18000, profit: 5400 },
            { name: 'Aug', revenue: 35000, profit: 10500 }
          ],
          profitData: [
            { name: 'Week 1', profit: 8500 },
            { name: 'Week 2', profit: 12300 },
            { name: 'Week 3', profit: 9800 },
            { name: 'Week 4', profit: 15400 }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DharmaDhristi Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your pooja products store.</p>

          {/* Time Range Selector */}
          <div className="mt-4 flex items-center gap-4">
            {/* <label className="text-sm font-medium text-gray-700">Time Range:</label> */}
            {/* <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 3 Months</option>
              <option value="1year">Last Year</option>
            </select> */}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={dashboardData.totalUsers} icon={<Users className="h-6 w-6 text-blue-600" />} color="blue" />
          <StatCard title="Total Orders" value={dashboardData.totalOrders} icon={<ShoppingCart className="h-6 w-6 text-green-600" />} color="green" />
          <StatCard title="Total Revenue" value={formatCurrency(dashboardData.totalRevenue)} icon={<DollarSign className="h-6 w-6 text-purple-600" />} color="purple" />
          <StatCard title="Total Profit" value={formatCurrency(dashboardData.totalProfit)} icon={<TrendingUp className="h-6 w-6 text-orange-600" />} color="orange" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Revenue Overview">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Profit Analysis">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Weekly Profit']} />
                <Legend />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Active Orders */}
        <ActiveOrders orders={dashboardData.activeOrders} formatCurrency={formatCurrency} formatDate={formatDate} />
      </div>
    </div>
  );

  function getStatusColor(status) {
    const colors = {
      'Order Placed': 'bg-blue-100 text-blue-800',
      Processing: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-green-100 text-green-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
      Refunded: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  function StatCard({ title, value, icon, color }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`bg-${color}-100 p-3 rounded-full`}>{icon}</div>
        </div>
      </div>
    );
  }

  function ChartCard({ title, children }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        {children}
      </div>
    );
  }

  function ActiveOrders({ orders, formatCurrency, formatDate }) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
          <span className="text-sm text-gray-600">{orders.length} active orders</span>
        </div>
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active orders at the moment</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-mono text-sm">{order._id}</td>
                    <td className="py-4 px-4">{order.customerName}</td>
                    <td className="py-4 px-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-600">
                          {item.name} (Qty: {item.quantity})
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-4">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
};

export default Dashboard;