import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', image: '', category: '', subcategory: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [newReview, setNewReview] = useState({ productId: '', rating: '', comment: '' });
  const [showReviews, setShowReviews] = useState({});
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [productsRes, reviewsRes] = await Promise.all([
        axios.get('http://localhost:3000/products'),
        axios.get('http://localhost:3000/reviews'),
      ]);
      const productsWithReviews = productsRes.data.map((product) => ({
        ...product,
        reviews: reviewsRes.data.filter((review) => review.productId === product.id),
      }));
      setProducts(productsWithReviews);
      toast.success('Products fetched successfully');
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/products', newProduct);
      setNewProduct({ title: '', price: '', image: '', category: '', subcategory: "",sizes: ""});
      fetchProducts();
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async (product) => {
    try {
      await axios.put(`http://localhost:3000/products/${product.id}`, product);
      setEditingProduct(null);
      fetchProducts();
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error editing product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      // Delete associated reviews first
      const reviews = products.find((p) => p.id === id)?.reviews || [];
      await Promise.all(reviews.map((review) => axios.delete(`http://localhost:3000/reviews/${review.id}`)));
      await axios.delete(`http://localhost:3000/products/${id}`);
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleAddReview = async (e, productId) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/reviews', {
        productId,
        userId: currentUser.id,
        rating: parseInt(newReview.rating),
        comment: newReview.comment,
      });
      setNewReview({ productId: '', rating: '', comment: '' });
      fetchProducts();
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/reviews/${reviewId}`);
      fetchProducts();
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const toggleReviews = (productId) => {
    setShowReviews((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleBack = () => {
    navigate('/admindashboard');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-teal-600">Products</h2>
        <button
          onClick={handleBack}
          className="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Back
        </button>
      </div>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="mb-8 p-4 bg-teal-100 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            required
          />
          <input
            type="text"
            placeholder="Subcategory"
            value={newProduct.subcategory}
            onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            required
          />
           <input
            type="text"
            placeholder="Sizes"
            value={newProduct.subcategory}
            onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 transition text-sm sm:text-base"
        >
          Add Product
        </button>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 bg-white rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">{product.title}</h3>
                <p className="text-sm sm:text-base">Price: ₹{product.price} - {product.quantity}</p>
                <p className="text-sm sm:text-base">Category: {product.category} - {product.subcategory}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2 mt-2 sm:mt-0 sm:ml-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 text-sm sm:text-base transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 text-sm sm:text-base transition"
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => toggleReviews(product.id)}
                className="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 text-sm sm:text-base transition"
              >
                {showReviews[product.id] ? 'Hide Reviews' : 'Show Reviews'}
              </button>
            </div>
            {showReviews[product.id] && (
              <div className="w-full mt-4 p-4 bg-teal-100 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Reviews</h4>
                {product.reviews.length === 0 ? (
                  <p className="text-sm text-red-500">No reviews yet.</p>
                ) : (
                  product.reviews.map((review) => (
                    <div key={review.id} className="mb-2 p-2 bg-white rounded-md shadow">
                      <p className="text-sm sm:text-base">
                        <span className="text-teal-600">Rating: {review.rating} ★</span>
                      </p>
                      <p className="text-sm sm:text-base">Comment: {review.comment}<span className='text-sm teal-400'>by formiq</span></p>
                      <p className="text-sm text-gray-500">User ID: {review.userId}</p>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="mt-1 bg-red-500 text-white p-1 rounded-md hover:bg-red-600 text-xs sm:text-sm transition"
                      >
                        Delete Review
                      </button>
                    </div>
                  ))
                )}
                <form
                  onSubmit={(e) => handleAddReview(e, product.id)}
                  className="mt-4 grid grid-cols-1 gap-2"
                >
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    className="p-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="" disabled>
                      Select Rating
                    </option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} ★
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="p-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 text-sm sm:text-base transition"
                  >
                    Add Review
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-teal-600">Edit Product</h3>
            <input
              type="text"
              value={editingProduct.title}
              onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
              className="p-2 border rounded-md mb-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              className="p-2 border rounded-md mb-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={editingProduct.image}
              onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
              className="p-2 border rounded-md mb-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              className="p-2 border rounded-md mb-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={editingProduct.subcategory}
              onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
              className="p-2 border rounded-md mb-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditProduct(editingProduct)}
                className="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 text-sm sm:text-base transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 text-sm sm:text-base transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;