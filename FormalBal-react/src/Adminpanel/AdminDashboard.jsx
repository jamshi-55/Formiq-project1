import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        
        axios.get('http://localhost:3000/users'),
        axios.get('http://localhost:3000/products'),
        axios.get('http://localhost:3000/orders'),
    
        
      ]);
         
      const revenue = ordersRes.data.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
      setStats({
        users: usersRes.data.length,
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        revenue: revenue.toFixed(2),
      });
      toast.success('Dashboard stats loaded successfully');
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/user');
  };

  // Chart settings(not completed have to check about this)
  const maxRevenue = Math.max(parseFloat(stats.revenue), 1000); // Scale chart to revenue or min ₹1000
  const barWidth = 100; // Fixed width for single bar in percentage
  const barHeight = (parseFloat(stats.revenue) / maxRevenue) * 100; // Height as percentage of max

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-teal-600">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-teal-100 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-xl sm:text-2xl text-teal-600">{stats.users}</p>
        </div>
        <div className="p-4 bg-teal-100 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-xl sm:text-2xl text-teal-600">{stats.products}</p>
        </div>
        <div className="p-4 bg-teal-100 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-xl sm:text-2xl text-teal-600">{stats.orders}</p>
        </div>
        <div className="p-4 bg-teal-600 rounded-lg shadow text-white">
          <h3 className="text-base sm:text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl sm:text-3xl font-bold">Rs.{stats.revenue}</p>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Revenue Overview</h3>
        <div className="bg-teal-100 rounded-lg p-4 h-24 sm:h-32">
          <svg className="w-full h-full">
            <rect
              x="0"
              y={`${100 - barHeight}%`}
              width={`${barWidth}%`}
              height={`${barHeight}%`}
              fill="#14b8a6"
              className="transition-all duration-500"
            />
            <text
              x="0"
              y="15"
              fill="#1f2937"
              className="text-xs sm:text-sm font-medium"
            >
              Rs.{stats.revenue}
            </text>
          </svg>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <Link
          to="/adminusers"
          className="p-3 bg-teal-600 text-white text-center rounded-md hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Manage Users
        </Link>
        <Link
          to="/adminproducts"
          className="p-3 bg-teal-600 text-white text-center rounded-md hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Manage Products
        </Link>
        <Link
          to="/adminorders"
          className="p-3 bg-teal-600 text-white text-center rounded-md hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;