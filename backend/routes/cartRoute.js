import express from 'express'
import { addToCart, getCart, updateCart,clearCart} from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/get',authUser,getCart)
cartRouter.post('/add',authUser,addToCart)
cartRouter.post('/update',authUser,updateCart)
cartRouter.post('/clear', authUser,clearCart);

export default cartRouter