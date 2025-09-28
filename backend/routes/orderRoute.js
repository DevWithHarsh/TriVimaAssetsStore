import express from 'express'
import { 
    placeOrderPayPal,
    verifyPayPal,
    allOrders, 
    updateStatus, 
    userOrders, 
    removeOrder,
    removeUserOrder
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/remove', adminAuth, removeOrder)

// PayPal Payment Features
orderRouter.post('/paypal', authUser, placeOrderPayPal)
orderRouter.post('/verifyPayPal', authUser, verifyPayPal)

// User Features
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/remove-userOrder', authUser, removeUserOrder)

export default orderRouter