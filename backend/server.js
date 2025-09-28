import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import reviewRouter from './routes/reviewRoute.js'
import couponRouter from './routes/couponCodeRoute.js';

const app = express()
const port = process.env.PORT || 4000

// CORS configuration
app.use(cors({
  origin: [
    'https://www.dharmadristi.com',
    'https://dharmadristi.com',
    'https://dharmadristiadmin.vercel.app',
    'https://dharmadristibackend.vercel.app',
    'http://localhost:5173',  // For local development
    'http://localhost:3000',  // For local development
    'http://localhost:5174'   // For local admin development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'token'],
  exposedHeaders: ['Authorization', 'token']
}))

// Connect DB + Cloudinary
connectDB()
connectCloudinary()

// Middleware
app.use(express.json())

// API Routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', dashboardRoutes)
app.use('/api/review', reviewRouter)
app.use('/api/coupon', couponRouter);

app.get('/', (req, res) => {
  res.send("API Working ✅")
})

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
