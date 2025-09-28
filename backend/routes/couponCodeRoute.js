import express from 'express';
import { 
  addCoupon, 
  listCoupons, 
  removeCoupon, 
  updateCouponStatus, 
  applyCoupon, 
  removeCouponFromCart, 
  getActiveCoupons 
} from '../controllers/couponController.js';
import adminAuth from '../middleware/adminAuth.js';
import auth from '../middleware/auth.js';

const couponRouter = express.Router();

// Admin routes
couponRouter.post('/add', adminAuth, addCoupon);
couponRouter.get('/list', adminAuth, listCoupons);
couponRouter.post('/remove', adminAuth, removeCoupon);
couponRouter.post('/update-status', adminAuth, updateCouponStatus);

// User routes
couponRouter.post('/apply', auth, applyCoupon);
couponRouter.post('/remove', auth, removeCouponFromCart);
couponRouter.get('/active', getActiveCoupons);

export default couponRouter;