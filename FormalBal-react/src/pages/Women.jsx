
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Women() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState('all');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products', {
          params: {
            category: 'women',
            ...(subcategory !== 'all' && { subcategory }),
          },
        });
        setProducts(response.data);
        setError('');
        setLoading(false);
      } catch (error) {
        console.error('Products fetch error:', error);
        setError(' loading products failed');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategory]);

  const handleSubcategoryChange = (newSubcategory) => {
    setSubcategory(newSubcategory);
    setLoading(true);
  };

  const addToBag = async (product) => {
    try {
      await axios.post('http://localhost:3000/bag', { ...product, userEmail :user.email ||'guest' });
      toast.success(`${product.name} added to bag!`);
    } catch (error) {
      console.error('Error bag:', error);
      toast.error('adding to bag failed');
    }
  };
  //whishlist
  
  const addToWishlist = async (product) => {
    try {
      await axios.post('http://localhost:3000/wishlist', { ...product, userEmail: user.email || "guest" });
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist.');
    }
  };
  //display

  if (loading) return <div className="text-center py-8 text-gray-600 text-sm sm:text-base">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {error && (
        <p className="text-red-600 text-center text-sm sm:text-base mb-4 sm:mb-6">{error}</p>
      )}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sticky top-32 z-50">
        <button
          onClick={() => handleSubcategoryChange('all')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            subcategory === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
          } hover:bg-teal-700 hover:text-white transition duration-300`}
        >
          All
        </button>
        <button
          onClick={() => handleSubcategoryChange('shirt')}
          className={`px-3 py-1. ԅsm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            subcategory === 'shirt' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
          } hover:bg-teal-700 hover:text-white transition duration-300`}
        >
          Shirts
        </button>
        <button
          onClick={() => handleSubcategoryChange('pant')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            subcategory === 'pant' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
          } hover:bg-teal-700 hover:text-white transition duration-300`}
        >
          Pants
        </button>
        <button
          onClick={() => handleSubcategoryChange('suit')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
            subcategory === 'suit' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
          } hover:bg-teal-700 hover:text-white transition duration-300`}
        >
          Dresses
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <Link
              to={`/productdetails/${product.id}`}
              key={product.id}
              className="border rounded-lg p-4 sm:p-5 bg-white shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 sm:h-48 lg:h-52 object-contain rounded-md mb-3 sm:mb-4"
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                Rs.{product.price}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToBag(product);
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-600 text-white rounded-md text-sm sm:text-base hover:bg-teal-700 transition duration-300"
                >
                  Bag
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToWishlist(product);
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-md text-sm sm:text-base hover:bg-gray-300 transition duration-300"
                >
                  Wishlist
                </button>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-600 text-sm sm:text-base">
            No products in this subcategory.
          </p>
        )}
      </div>
    </div>
  );
}


export default Women;
