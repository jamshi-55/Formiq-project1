import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [cancelReason, setCancelReason] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/orders');
      setOrders(response.data);
      toast.success('Orders fetched successfully');
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  const handleStatusChange = async (orderId, newStatus, reason = '') => {
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'Cancelled') {
        updateData.cancelReason = reason || cancelReason[orderId] || 'No reason provided';
      }
      await axios.patch(`http://localhost:3000/orders/${orderId}`, updateData);
      fetchOrders();
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleCancelReasonSubmit = (orderId, reason) => {
    setCancelReason((prev) => ({ ...prev, [orderId]: reason }));
    handleStatusChange(orderId, 'Cancelled', reason);
  };

  const handleBack = () => {
    navigate('/admindashboard');
  };

  const activeOrders = orders.filter((order) => order.status !== 'Cancelled');
  const cancelledOrders = orders.filter((order) => order.status === 'Cancelled');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-teal-600">Manage Orders</h2>
        <button
          onClick={handleBack}
          className="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Back
        </button>
      </div>

      {/* Active Orders */}
      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-black mb-4">Active Orders</h3>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-teal-400">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Order ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Products</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Total</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 sm:px-6 py-4 text-sm text-gray-500 text-center">
                    No active orders.
                  </td>
                </tr>
              ) : (
                activeOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{order.id}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{order.userId}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                      {order.products && order.products.length > 0 ? (
                        <div className="flex space-x-2">
                          {order.products.map((item, index) => (
                            <img
                              key={index}
                              src={item.image}
                              alt={`Product ${item.productId}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                            />
                          ))}
                        </div>
                      ) : (
                        <span>No images</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">₹{order.total}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{order.status}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                      {statusUpdate[order.id] === 'Cancelled' ? (
                        <div className="flex flex-col space-y-2">
                          <input
                            type="text"
                            placeholder="Cancel reason"
                            value={cancelReason[order.id] || ''}
                            onChange={(e) =>
                              setCancelReason((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                            required
                          />
                          <button
                            onClick={() => handleCancelReasonSubmit(order.id, cancelReason[order.id])}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                          >
                            Confirm Cancel
                          </button>
                        </div>
                      ) : (
                        <select
                          value={statusUpdate[order.id] || order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setStatusUpdate((prev) => ({ ...prev, [order.id]: newStatus }));
                            if (newStatus !== 'Cancelled') {
                              handleStatusChange(order.id, newStatus);
                            }
                          }}
                          className="p-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancelled Orders */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-black mb-4">Cancelled Orders</h3>
        <div className="bg-white  rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-teal-400">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Order ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Products</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Total</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Cancel Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cancelledOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 sm:px-6 py-4 text-sm text-gray-500 text-center">
                    No cancelled orders.
                  </td>
                </tr>
              ) : (
                cancelledOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{order.id}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{order.userId}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                      {order.products && order.products.length > 0 ? (
                        <div className="flex space-x-2">
                          {order.products.map((item, index) => (
                            <img
                              key={index}
                              src={item.image}
                              alt={`Product ${item.productId}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                            />
                          ))}
                        </div>
                      ) : (
                        <span>No images</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">₹{order.total}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{order.status}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">{order.cancelReason || 'No reason provided'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;