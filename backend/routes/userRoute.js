import express from 'express';
import authUser from '../middleware/auth.js';
import {
  loginUser, registerUser, adminLogin,
  getWishlist, addWishlist, removeWishlist
} from '../controllers/userController.js';

import {
  sendForgotOTP,
  resetPassword
} from '../controllers/forgotPasswordController.js';

const userRouter = express.Router();

// ✅ Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/forgot-password', sendForgotOTP);
userRouter.post('/reset-password', resetPassword);

// ✅ Protected routes
userRouter.use(authUser);
userRouter.post('/wishlist', getWishlist);
userRouter.post('/wishlist/add', addWishlist);
userRouter.post('/wishlist/remove', removeWishlist);

export default userRouter;
