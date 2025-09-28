import reviewModel from '../models/reviewModel.js';
import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';

// Add a new review
const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.body.userId;

    // Validate input
    if (!productId || !orderId || !rating || !comment) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if order exists and belongs to user
    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.json({ success: false, message: "Order not found or unauthorized" });
    }

    // Check if order is delivered
    if (order.status !== 'Completed') {
      return res.json({ success: false, message: "You can only review delivered products" });
    }

    // Check if product exists in the order
    const productInOrder = order.items.find(item => item._id === productId);
    if (!productInOrder) {
      return res.json({ success: false, message: "Product not found in this order" });
    }

    // Check if user already reviewed this product
    const existingReview = await reviewModel.findOne({ userId, productId });
    if (existingReview) {
      return res.json({ success: false, message: "You have already reviewed this product" });
    }

    // Get user name
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Create new review
    const newReview = new reviewModel({
      userId,
      productId,
      orderId,
      rating: Number(rating),
      comment: comment.trim(),
      userName: user.name,
      isVerifiedPurchase: true
    });

    await newReview.save();

    // Update product average rating
    await updateProductRating(productId);

    res.json({ success: true, message: "Review added successfully", review: newReview });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const reviews = await reviewModel.find({ productId })
      .sort({ date: -1 })
      .populate('userId', 'name');

    // Calculate rating statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    res.json({ 
      success: true, 
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's reviewable products (delivered products without reviews)
const getReviewableProducts = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Get all delivered orders for the user
    const deliveredOrders = await orderModel.find({ 
      userId, 
      status: 'Completed' 
    });

    // Get all products from delivered orders
    let reviewableProducts = [];
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        // Check if user already reviewed this product
        const existingReview = await reviewModel.findOne({ 
          userId, 
          productId: item._id 
        });

        if (!existingReview) {
          // Get full product details
          const product = await productModel.findById(item._id);
          if (product) {
            reviewableProducts.push({
              ...item,
              orderId: order._id,
              orderDate: order.date,
              productDetails: product
            });
          }
        }
      }
    }

    res.json({ success: true, reviewableProducts });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;
    const userId = req.body.userId;

    if (!reviewId || !rating || !comment) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const review = await reviewModel.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.json({ success: false, message: "Review not found or unauthorized" });
    }

    review.rating = Number(rating);
    review.comment = comment.trim();
    await review.save();

    // Update product average rating
    await updateProductRating(review.productId);

    res.json({ success: true, message: "Review updated successfully", review });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const userId = req.body.userId;

    const review = await reviewModel.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.json({ success: false, message: "Review not found or unauthorized" });
    }

    const productId = review.productId;
    await reviewModel.findByIdAndDelete(reviewId);

    // Update product average rating
    await updateProductRating(productId);

    res.json({ success: true, message: "Review deleted successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Helper function to update product average rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await reviewModel.find({ productId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    await productModel.findByIdAndUpdate(productId, {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews
    });
  } catch (error) {
    console.log("Error updating product rating:", error);
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.body.userId;

    const reviews = await reviewModel.find({ userId })
      .populate({
        path: 'productId',
        select: 'name image price',
        // This will include reviews even if productId is null
        options: { strictPopulate: false }
      })
      .sort({ date: -1 });

    // Filter out reviews where product is null (deleted products)
    const validReviews = reviews.filter(review => review.productId);

    res.json({ success: true, reviews: validReviews });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { 
  addReview, 
  getProductReviews, 
  getReviewableProducts, 
  updateReview, 
  deleteReview, 
  getUserReviews 
};