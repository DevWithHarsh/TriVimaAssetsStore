import React from 'react';

const ReviewItem = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StarDisplay = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            className={`text-base transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-xs text-gray-400">({rating}/5)</span>
      </div>
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-[#2a2d35] border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        {/* Left: Avatar, user + stars */}
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#3dd68c] to-[#2bc77a] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-sm">
              {getInitials(review.userName)}
            </span>
          </div>
          
          {/* User info and rating */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="font-medium text-white text-sm">
                {review.userName}
              </h4>
              {review.isVerifiedPurchase && (
                <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
            <StarDisplay rating={review.rating} />
          </div>
        </div>

        {/* Right: date */}
        <div className="text-xs text-gray-400 flex-shrink-0">
          {formatDate(review.date)}
        </div>
      </div>

      {/* Review Content */}
      <div className="text-gray-300 leading-relaxed text-sm break-words pl-13">
        {review.comment}
      </div>
      
      {/* Bottom border accent */}
      <div className="w-12 h-0.5 bg-gradient-to-r from-[#3dd68c] to-transparent mt-3 rounded-full"></div>
    </div>
  );
};

export default ReviewItem;