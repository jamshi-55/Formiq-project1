import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GiConfirmed } from "react-icons/gi";

function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    mobile: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const maxQuantity = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get(`http://localhost:3000/products/${id}`);
          const selectedSize = location.state?.selectedSize || '';
          setProduct(response.data);
          setItems([{ ...response.data, quantity: 1, selectedSize }]);
        } else if (location.state?.bagItems) {
          setItems(
            location.state.bagItems.map(item => ({
              ...item,
              quantity: 1,
              selectedSize: item.selectedSize || '',
            }))
          );
        } else {
          setError('No items to order');
        }
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.state]);

  const backbutton = () => {
    navigate( `/productdetails/${id}`);
  };

  // Validation for sizes, quantity and address fields
  const validateForm = () => {
    const errors = {};
    items.forEach((item, index) => {
      if (!item.selectedSize) errors[`size_${index}`] = `Please select a size for ${item.name}`;
      if (item.quantity < 1 || item.quantity > maxQuantity)
        errors[`quantity_${index}`] = `Quantity must be between 1 and ${maxQuantity} for ${item.name}`;
    });
    if (!address.street.trim()) errors.street = 'Street is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state.trim()) errors.state = 'State is required';
    if (!address.zip.trim()) errors.zip = 'Zip code is required';
    if (!address.country.trim()) errors.country = 'Country is required';
    if (!address.mobile.trim() || !/^\d{10}$/.test(address.mobile))
      errors.mobile = 'Valid 10-digit mobile number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proceed to payment if form is valid
  const handleConfirmOrder = () => {
    if (!validateForm()) return;

    navigate('/payment', {
      state: { items, address, userEmail: user.email || 'guest' },
    });
  };

  // Update quantity or size for each item
  const updateItem = (index, updates) => {
    setItems(items.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 lg:py-10">
        <p className="text-red-600 text-sm sm:text-base lg:text-lg">{error || 'No items to order'}</p>
        <button
          onClick={backbutton}
          className="mt-4 px-4 py-2 sm:px-6 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Back
        </button>
      </div>
    );
  }

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 min-h-screen">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Place Your Order</h1>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 mb-4 sm:mb-6 border-b pb-4 sm:pb-6"
          >
            <div className="w-full sm:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">{item.name}</h2>
                <p className="text-teal-600 text-sm sm:text-base lg:text-lg font-semibold mb-2">
                  Rs {item.price.toLocaleString()}
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-2">{item.description || 'No description available'}</p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">Size: {item.selectedSize || 'Not selected'}</p>
                {formErrors[`size_${index}`] && (
                  <p className="text-red-600 text-xs sm:text-sm">{formErrors[`size_${index}`]}</p>
                )}

                <div className="mb-4">
                  <label
                    htmlFor={`size_${index}`}
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Size
                  </label>
                  <select
                    id={`size_${index}`}
                    value={item.selectedSize}
                    onChange={e => updateItem(index, { selectedSize: e.target.value })}
                    className={`w-full p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                      formErrors[`size_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor={`quantity_${index}`}
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`quantity_${index}`}
                    min="1"
                    max={maxQuantity}
                    value={item.quantity}
                    onChange={e => {
                      // Prevent quantity less than 1
                      let val = Number(e.target.value);
                      if (val < 1) val = 1;
                      else if (val > maxQuantity) val = maxQuantity;
                      updateItem(index, { quantity: val });
                    }}
                    className={`w-16 sm:w-20 p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                      formErrors[`quantity_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors[`quantity_${index}`] && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1">{formErrors[`quantity_${index}`]}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 flex justify-center sm:justify-end">
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain rounded-lg"
              />
            </div>
          </div>
        ))}

        <div className="mt-4 sm:mt-6 p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleConfirmOrder();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="street" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Street
                </label>
                <input
                  id="street"
                  type="text"
                  value={address.street}
                  onChange={e => setAddress(prev => ({ ...prev, street: e.target.value }))}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                    formErrors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.street && <p className="text-red-600 text-xs sm:text-sm mt-1">{formErrors.street}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={address.city}
                  onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                    formErrors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.city && <p className="text-red-600 text-xs sm:text-sm mt-1">{formErrors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={address.state}
                  onChange={e => setAddress(prev => ({ ...prev, state: e.target.value }))}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                    formErrors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.state && <p className="text-red-600 text-xs sm:text-sm mt-1">{formErrors.state}</p>}
              </div>

              <div>
                <label htmlFor="zip" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  id="zip"
                  type="text"
                  value={address.zip}
                  onChange={e => setAddress(prev => ({ ...prev, zip: e.target.value }))}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                    formErrors.zip ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.zip && <p className="text-red-600 text-xs sm:text-sm mt-1">{formErrors.zip}</p>}
              </div>

              <div>
                <label htmlFor="country" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={address.country}
                  onChange={e => setAddress(prev => ({ ...prev, country: e.target.value }))}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                    formErrors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.country && <p className="text-red-600 text-xs sm:text-sm mt-1">{formErrors.country}</p>}
              </div>

              <div>
                <label htmlFor="mobile" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  maxLength={10}
                  value={address.mobile}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, ''); // only digits
                    setAddress(prev => ({ ...prev, mobile: val }));
                  }}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${
                    formErrors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.mobile && <p className="text-red-600 text-xs sm:text-sm mt-1">{formErrors.mobile}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={backbutton}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition text-sm sm:text-base"
              >
                Back
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-teal-700 transition text-sm sm:text-base"
              >
                Confirm Order <GiConfirmed size={24} />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-right text-lg sm:text-xl font-semibold text-gray-900">
          Total: Rs {totalPrice.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default Order;
