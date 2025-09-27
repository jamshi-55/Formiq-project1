import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard, FaLock, FaMobileAlt } from 'react-icons/fa';
import { BsCurrencyRupee } from "react-icons/bs";
import { toast } from 'react-toastify';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, address } = location.state || {};
  const userEmail = localStorage.getItem('userEmail');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiOption, setUpiOption] = useState('Paytm');
  const [isProcessing, setIsProcessing] = useState(false);

  const baseTotal = items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  const codCharge = paymentMethod === 'cod' ? 70 : 0;
  const totalPrice = baseTotal + codCharge;

  // Calculate estimated delivery date (5 days from now)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const formattedDelivery = estimatedDelivery.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleConfirmPayment = async () => {
    if (!userEmail) {
      toast.warn('Please log in to proceed', {
        position: 'top-center',
        autoClose: 3000,
      });
      navigate('/ordertrack');
      toast.success("payment completed succesfully")
      return;
    }

    if (!items || !address) {
      toast.error('Missing order details or address', {
        position: 'top-center',
        autoClose: 3000,
      });
      navigate('/order');
      return;
    }

    setIsProcessing(true);
    try {
      const paymentPromises = items.map(item =>
        axios.post('http://localhost:3000/payments', {
          productId: item.productId || item.id,
          userEmail,
          quantity: item.quantity,
          size: item.selectedSize,
          totalPrice: item.price * item.quantity + (paymentMethod === 'cod' ? 70 / items.length : 0), // Distribute COD fee
          address,
          paymentMethod,
          paymentDetails:
            paymentMethod === 'upi'
              ? { method: 'UPI', app: upiOption }
              : { method: paymentMethod === 'card' ? 'Card' : 'Cash on Delivery' },
          orderDate: new Date().toISOString(),
          status: 'pending',
          cancelReason: '',
        })
      );
      const paymentResponses = await Promise.all(paymentPromises);

      const bagResponse = await axios.get('http://localhost:3000/bag', { params: { userEmail } });
      const deletePromises = bagResponse.data.map(bagItem =>
        axios.delete(`http://localhost:3000/bag/${bagItem.id}`)
      );
      await Promise.all(deletePromises);

      toast.success(
        paymentMethod === 'cod'
          ? `Order placed! Pay ₹${totalPrice.toLocaleString('en-IN')} on delivery.`
          : `Order placed! Payment of ₹${totalPrice.toLocaleString('en-IN')} processed.`,
        {
          position: 'top-center',
          autoClose: 3000,
          progressStyle: { background: '#1e3a8a' }, // Navy blue for formal wear theme
        }
      );
      navigate('/ordertrack', { state: { payments: paymentResponses.map(res => res.data) } });
    } catch (error) {
      toast.error(`Payment failed: ${error.response?.data?.message || error.message}`, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate('/order', { state: { bagItems: items } });
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Items to Process</h2>
          <p className="text-gray-600 mb-6">Your cart is empty. Add some formal wear to proceed.</p>
          <button
            onClick={() => navigate('/order')}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            aria-label="Return to cart"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-gray-600 mt-2">Complete your purchase of premium formal wear</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary & Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span>Order Summary</span>
                <span className="ml-2 text-sm text-gray-500">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              </h2>
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800">{item.name}</h3>
                    <p className="text-indigo-600 text-sm sm:text-base">₹{item.price.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-500">Size: {item.selectedSize || 'Not selected'}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-gray-800">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
              { paymentMethod === 'cod' && (
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <span>Cash on Delivery Fee</span>
                  <span>₹70</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold text-gray-800 pt-4">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Estimated Delivery: {formattedDelivery}</p>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
              {address ? (
                <div className="text-sm sm:text-base text-gray-700">
                  <p className="font-medium">{address.name}</p>
                  <p>{address.street}, {address.city}, {address.state} - {address.zip}</p>
                  <p>Phone: {address.phone || 'Not provided'}</p>
                  <button
                    onClick={() => navigate('/adreschange')}
                    className="text-teal-500 hover:text-teal-600 text-sm mt-2"
                    aria-label="Change delivery address"
                  >
                    Change Address
                  </button>
                </div>
              ) : (
                <p className="text-red-600">No address provided</p>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="form-radio h-5 w-5 text-indigo-600"
                  aria-checked={paymentMethod === 'cod'}
                />
                <BsCurrencyRupee size={24} className="text-teal-600" />
                <div>
                  <span className="text-base font-medium text-gray-800">Cash on Delivery</span>
                  <p className="text-sm text-gray-500">Pay ₹{totalPrice.toLocaleString('en-IN')} (includes ₹70 fee) on delivery</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="form-radio h-5 w-5 text-teal-600"
                  aria-checked={paymentMethod === 'card'}
                />
                <FaCreditCard size={24} className="text-teal-600" />
                <div>
                  <span className="text-base font-medium text-gray-800">Card Payment</span>
                  <p className="text-sm text-gray-500">Credit/Debit Cards</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="form-radio h-5 w-5 text-indigo-600"
                  aria-checked={paymentMethod === 'upi'}
                />
                <FaMobileAlt size={24} className="text-teal-600" />
                <div>
                  <span className="text-base font-medium text-gray-800">UPI</span>
                  <p className="text-sm text-gray-500">Paytm, GPay, PhonePe</p>
                  {paymentMethod === 'upi' && (
                    <select
                      value={upiOption}
                      onChange={(e) => setUpiOption(e.target.value)}
                      className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      aria-label="Select UPI app"
                    >
                      <option value="Paytm">Paytm</option>
                      <option value="GPay">GPay</option>
                      <option value="PhonePe">PhonePe</option>
                    </select>
                  )}
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2 mb-6 text-sm text-black">
              <FaLock size={16} className="text-gray-500" />
              <span>100% Secure Payments</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className={`flex-1 py-3 px-6 bg-teal-500 text-white rounded-lg font-medium text-base hover:bg-teal-600 transition ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={isProcessing ? 'Processing order' : 'Place order'}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
              <button
                onClick={handleBack}
                disabled={isProcessing}
                className={`flex-1 py-3 px-6 bg-red-400 text-white rounded-lg font-medium text-base hover:bg-red-500 transition ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Back 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;