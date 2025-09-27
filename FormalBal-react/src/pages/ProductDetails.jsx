import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const userEmail = localStorage.getItem('userEmail');
  const fromCategory = location.state?.fromCategory || 'men';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data);
        setSelectedSize(response.data.sizes?.[0] || '');
      } catch (err) {
        setProductError(`Failed to fetch product: ${err.message}`);
      } finally {
        setLoadingProduct(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/reviews?productId=${id}`);
        setReviews(response.data);
      } catch (err) {
        setReviewsError(`Failed to fetch reviews: ${err.message}`);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const retryFetch = (type) => {
    if (type === 'product') {
      setLoadingProduct(true);
      setProductError(null);
      axios
        .get(`http://localhost:3000/products/${id}`)
        .then((response) => {
          setProduct(response.data);
          setSelectedSize(response.data.sizes?.[0] || '');
        })
        .catch((err) => setProductError(`Failed to fetch product: ${err.message}`))
        .finally(() => setLoadingProduct(false));
    } else if (type === 'reviews') {
      setLoadingReviews(true);
      setReviewsError(null);
      axios
        .get(`http://localhost:3000/reviews?productId=${id}`)
        .then((response) => setReviews(response.data))
        .catch((err) => setReviewsError(`Failed to fetch reviews: ${err.message}`))
        .finally(() => setLoadingReviews(false));
    }
  };

  const handleOrderClick = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    navigate(`/order/${id}`, { state: { selectedSize } });
  };

  const backbutton = () => {
    navigate(`/${fromCategory}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      toast.warn('Please log in to submit a review');
      navigate('/user');
      return;
    }
    if (!newReview.rating || !newReview.comment.trim()) {
      toast.error('Please provide both a rating and a comment');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/reviews', {
        productId: id,
        userEmail,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review.');
    }
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg">{productError}</p>
        <button
          onClick={() => retryFetch('product')}
          className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-8 text-lg text-gray-600">Product not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="w-full lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-64 sm:max-h-80 lg:max-h-96 object-contain rounded-lg"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-teal-600 text-xl sm:text-2xl font-semibold">
            Rs {product.price.toLocaleString()}
          </p>
          <p className="text-base text-gray-700">{product.description}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Rating:</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                  size={18}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">({averageRating} from {reviews.length} reviews)</span>
            </div>
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full sm:w-40 p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select Size</option>
              {product.sizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={handleOrderClick}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-base font-medium"
            >
              Place Order
            </button>
            <button
              onClick={backbutton}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-base font-medium"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        {loadingReviews ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
          </div>
        ) : reviewsError ? (
          <div className="text-center">
            <p className="text-red-600 text-base">{reviewsError}</p>
            <button
              onClick={() => retryFetch('reviews')}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-base">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      size={18}
                    />
                  ))}
                </div>
                <p className="text-base text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-1">By {review.userEmail}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Write a Review</h4>
          {userEmail ? (
            <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={
                        index < newReview.rating
                          ? 'text-yellow-400 cursor-pointer'
                          : 'text-gray-300 cursor-pointer'
                      }
                      size={24}
                      onClick={() => handleRatingChange(index + 1)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-base"
                  placeholder="Share your thoughts about the product"
                  rows="4"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-base font-medium"
                >
                  Submit Review
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500 text-base">
              Please{' '}
              <a href="/user" className="text-teal-600 hover:underline">
                log in
              </a>{' '}
              to write a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;