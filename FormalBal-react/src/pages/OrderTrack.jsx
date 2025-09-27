// src/pages/OrderTrack.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderTrack = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const fetchOrderTracking = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders/${id}`);
        const data = response.data;
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order tracking:', error);
        toast.error('Failed to load tracking details');
        setLoading(false);
      }
    };

    fetchOrderTracking();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/orders/${id}/`, {
        reason: cancelReason,
      });

      setOrder((prev) => ({
        ...prev,
        status: 'Canceled',
        timeline: [
          ...prev.timeline,
          {
            status: 'Canceled',
            date: new Date().toISOString().split('T')[0],
            description: `Order canceled. Reason: ${cancelReason}`,
          },
        ],
      }));

      setShowCancelModal(false);
      setCancelReason('');
      toast.success('Order canceled successfully');
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600 text-lg">Order not found</div>
      </div>
    );
  }

  const canCancel = ['Pending', 'Packing'].includes(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Track Your Order</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700">Order #{order.orderId}</h2>
          <p className="text-gray-600 mt-1">
            Status:{' '}
            <span
              className={`font-medium ${
                order.status === 'Canceled' ? 'text-red-600' : 'text-teal-600'
              }`}
            >
              {order.status}
            </span>
          </p>
          {order.status !== 'Canceled' && (
            <>
              <p className="text-gray-600 mt-1">Estimated Delivery: {order.estimatedDelivery}</p>
              <p className="text-gray-600 mt-1">Tracking Number: {order.trackingNumber}</p>
              <p className="text-gray-600 mt-1">Carrier: {order.carrier}</p>
            </>
          )}
        </div>

        {/* Ordered products */}
        {order.products && order.products.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ordered Products</h3>
            <ul className="divide-y divide-gray-200">
              {order.products.map((product, index) => (
                <li key={index} className="py-2">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Tracking Timeline</h3>
          <div className="space-y-4">
            {order.timeline.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      step.status === order.status ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  ></div>
                  {index < order.timeline.length - 1 && (
                    <div className="w-px h-10 bg-gray-300 mx-2"></div>
                  )}
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-800">{step.status}</p>
                  <p className="text-sm text-gray-600">{step.date}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </button>
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for canceling your order:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows="4"
              placeholder="Enter reason for cancellation"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrack;
