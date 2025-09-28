import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import ReviewForm from '../components/ReviewForm';

const WriteReview = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [reviewableProducts, setReviewableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReviewableProducts = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/review/reviewable-products`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setReviewableProducts(response.data.reviewableProducts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reviewable products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewableProducts();
  }, [token]);

  const handleReviewSubmitted = () => {
    fetchReviewableProducts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-10 px-4 sm:px-6 lg:px-12 xl:px-20">
      {/* Page Title */}
      <div className="text-2xl md:text-3xl font-semibold mb-10 text-center">
        <Title text1={'WRITE'} text2={'REVIEWS'} />
      </div>

      {reviewableProducts.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
            You can write reviews for the following delivered products:
          </p>

          {/* Responsive Grid */}
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reviewableProducts.map((item) => (
              <div
                key={`${item._id}-${item.orderId}`}
                className="bg-white shadow-md border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition"
              >
                <ReviewForm
                  product={item.productDetails}
                  orderId={item.orderId}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 px-4">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            No Products to Review
          </h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            You don’t have any delivered products available for review yet.
          </p>
          <button
            onClick={() => navigate('/categories')}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default WriteReview;
