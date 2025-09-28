import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// You might have middleware for admin authentication
// import { adminAuth } from '../middleware/auth.js'; // Adjust as needed

// Dashboard stats route
router.get('/dashboard', getDashboardStats);

// If you have admin authentication middleware, use it like this:
// router.get('/dashboard', adminAuth, getDashboardStats);

export default router;