import express from 'express';
import { 
  addReview, 
  getProductReviews, 
  getReviewableProducts, 
  updateReview, 
  deleteReview, 
  getUserReviews 
} from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

// User routes - require authentication
reviewRouter.post('/add', authUser, addReview);
reviewRouter.post('/update', authUser, updateReview);
reviewRouter.post('/delete', authUser, deleteReview);
reviewRouter.post('/user-reviews', authUser, getUserReviews);
reviewRouter.post('/reviewable-products', authUser, getReviewableProducts);

// Public routes - no authentication needed
reviewRouter.post('/product-reviews', getProductReviews);

export default reviewRouter;