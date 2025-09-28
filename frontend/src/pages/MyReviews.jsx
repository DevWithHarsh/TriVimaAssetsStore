import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const MyReviews = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const navigate = useNavigate();

  const fetchMyReviews = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/review/user-reviews`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        // Filter out reviews with missing or invalid product data
        const validReviews = response.data.reviews.filter(review => 
          review.productId && 
          review.productId.name && 
          review.productId.price !== undefined
        );
        setMyReviews(validReviews);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch your reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      if (editRating === 0 || editComment.trim().length < 10) {
        toast.error("Please provide a valid rating and comment (min 10 characters)");
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/review/update`,
        { reviewId, rating: editRating, comment: editComment.trim() },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review updated successfully!");
        setEditingReview(null);
        fetchMyReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/delete`,
        { reviewId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review deleted successfully!");
        fetchMyReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete review");
    }
  };

  const StarRating = ({ rating, setRating, disabled = false }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={`text-lg sm:text-xl transition-colors ${
              star <= (hoveredRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            } ${!disabled && 'hover:scale-110'}`}
            onClick={() => !disabled && setRating(star)}
            onMouseEnter={() => !disabled && setHoveredRating(star)}
            onMouseLeave={() => !disabled && setHoveredRating(0)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Helper function to get product image safely
  const getProductImage = (product) => {
    if (!product || !product.image || !Array.isArray(product.image) || product.image.length === 0) {
      // Return a placeholder image URL or empty string
      return '/placeholder-product.png'; // Make sure you have a placeholder image
    }
    return product.image[0];
  };

  useEffect(() => {
    fetchMyReviews();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-10 px-3 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-2xl md:text-3xl font-semibold mb-10 text-center">
        <Title text1={'MY'} text2={'REVIEWS'} />
      </div>

      {myReviews.length > 0 ? (
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {myReviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Product Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <img
                  src={getProductImage(review.productId)}
                  alt={review.productId?.name || 'Product'}
                  className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png'; // Fallback image
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-base sm:text-lg text-black">
                    {review.productId?.name || 'Product name unavailable'}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {currency}{review.productId?.price || 'Price unavailable'}
                  </p>
                  <p className="text-xs sm:text-sm text-black">
                    Reviewed on {new Date(review.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {editingReview === review._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <StarRating rating={editRating} setRating={setEditRating} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review
                    </label>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      rows="4"
                      maxLength="500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {editComment.length}/500 characters
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleUpdateReview(review._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="mb-3">
                    <StarRating rating={review.rating} setRating={() => {}} disabled />
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                    {review.comment}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit Review
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-20 px-4">
          <svg
            className="mx-auto h-14 w-14 sm:h-16 sm:w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            You haven't written any reviews yet. Purchase and receive products to start reviewing!
          </p>
          <button
            onClick={() => navigate('/categories')}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default MyReviews;