import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Bag() {
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBagItems();
  }, []);

  const fetchBagItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:3000/bag', {
        params: { userEmail: user.email},
      });
      console.log('Bag items response:', response.data);
      setBagItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Bag items fetch error:', error);
      setError('Failed to load bag items.');
      toast.error('Failed to load bag items.');
      setLoading(false);
    }
  };

  const removeFromBag = async (bagId) => {
    try {
      await axios.delete(`http://localhost:3000/bag/${bagId}`);
      setBagItems(bagItems.filter(item => item.id !== bagId));
      toast.success('Item removed from bag!');
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item, please try again.');
      toast.error('Failed to remove item, please try again.');
    }
  };

  const handleOrderAllClick = () => { 
    if (bagItems.length === 0) {
      toast.warn('Your bag is empty');
      return;
    }
    navigate('/order', { state: { bagItems } });
  };

  const totalAmount = bagItems.reduce((total, item) => total + item.price, 0);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600 text-sm sm:text-base lg:text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 min-h-screen">
      {error && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md gap-3 sm:gap-4">
          <p className="text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchBagItems}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm sm:text-base"
          >
            Try Again
          </button> 
        </div>
      )}
      {bagItems.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {bagItems.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center border rounded-lg p-4 sm:p-5 bg-white shadow-md hover:shadow-lg transition">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm sm:text-base text-gray-600">Rs.{item.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => removeFromBag(item.id)}
                  className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm sm:text-base"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 sm:p-5 rounded-lg gap-4 sm:gap-6">
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
              Total Amount= Rs.{totalAmount.toLocaleString()}
            </p>
            <button
              onClick={handleOrderAllClick}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition text-sm sm:text-base font-medium"
            >
              Order All Items
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 text-sm sm:text-base lg:text-lg">Your bag is empty.</p>
      )}
    </div>
  );
}

export default Bag;