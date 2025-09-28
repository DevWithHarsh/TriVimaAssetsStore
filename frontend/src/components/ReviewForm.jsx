import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewForm = ({ product, orderId, onReviewSubmitted }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/review/add`, {
        productId: product._id,
        orderId,
        rating,
        comment: comment.trim()
      }, { headers: { token } });

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setComment('');
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="flex flex-wrap gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl transition-colors ${
              star <= (hoveredRating || rating) 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-xs sm:text-sm text-gray-600">
          {rating > 0 && `${rating} out of 5 stars`}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-md mb-6">
      {/* Product Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <img 
          src={product.image[0]} 
          alt={product.name}
          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded"
        />
        <div>
          <h3 className="font-medium text-base sm:text-lg">{product.name}</h3>
          <p className="text-gray-600 text-sm">Write your review</p>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="w-full">
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating *
          </label>
          <StarRating />
        </div>

        {/* Review Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-black"
            rows="4"
            maxLength="500"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters (minimum 10 required)
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
