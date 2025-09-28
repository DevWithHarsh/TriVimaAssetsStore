import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import ReviewItem from './ReviewItem';

const ReviewList = ({ productId }) => {
  const { backendUrl } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/review/product-reviews`, { productId });
      if (response.data.success) {
        setReviews(response.data.reviews);
        setReviewStats({
          totalReviews: response.data.totalReviews,
          averageRating: response.data.averageRating,
          ratingDistribution: response.data.ratingDistribution
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const sortedReviews = React.useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default: // newest
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [reviews, sortBy]);

  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="w-4">{rating}</span>
        <span className="hidden sm:inline">★</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
          <div
            className="bg-yellow-400 h-2 sm:h-3 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-6 sm:w-8 text-right">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mt-8 px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Customer Reviews</h2>

      {reviewStats.totalReviews > 0 ? (
        <>
          {/* Rating Summary */}
          <div className="p-4 sm:p-6 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              {/* Overall Rating */}
              <div className="text-center md:w-1/4">
                <div className="text-3xl sm:text-4xl font-bold mb-2">{reviewStats.averageRating}</div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg sm:text-xl ${star <= Math.round(reviewStats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-green-50">
                  Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1">
                <h4 className="font-medium mb-3 text-sm sm:text-base">Rating Breakdown</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <RatingBar
                      key={rating}
                      rating={rating}
                      count={reviewStats.ratingDistribution[rating]}
                      total={reviewStats.totalReviews}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h3 className="text-base sm:text-lg font-medium">
              All Reviews ({reviewStats.totalReviews})
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-500 mb-2">No reviews yet</div>
          <div className="text-xs sm:text-sm text-gray-400">
            Be the first to review this product!
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
