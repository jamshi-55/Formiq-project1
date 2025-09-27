import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || null);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:3000/wishlist', {
        params: { userEmail: user.email },
      });
      console.log('Wishlist items response:', response.data);
      setWishlistItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Wishlist items fetch:', error);
      setError('Failed to load wishlist items.');
      toast.error('Failed to load wishlist items.');
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/wishlist/${id}`);
      setWishlistItems(wishlistItems.filter(item => item.id !== id));
      toast.success('Item removed from wishlist.');
    } catch (error) {
      console.error('Item remove:', error);
      setError('Failed to remove item, please try again.');
      toast.error('Failed to remove item, please try again.');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600 text-sm sm:text-base lg:text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 min-h-screen">
      {error && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md gap-3 sm:gap-4">
          <p className="text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchWishlistItems}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      )}
      {wishlistItems.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {wishlistItems.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center border rounded-lg p-4 sm:p-5 bg-white shadow-md hover:shadow-lg transition">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm sm:text-base text-gray-600">Rs.{item.price}</p>
              </div>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm sm:text-base mt-4 sm:mt-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-sm sm:text-base lg:text-lg">Your Wishlist is empty.</p>
      )}
    </div>
  );
}

export default Wishlist;