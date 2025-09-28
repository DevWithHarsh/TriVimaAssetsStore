import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  originalAmount: { type: Number, required: true }, // Amount before discount
  address: { type: Object, required: true },
  status: { 
    type: String, 
    default: 'Order Placed',
    enum: ['Order Placed', 'Processing', 'Digital Asset Ready', 'Completed']
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['PayPal'], // Only PayPal supported
    default: 'PayPal'
  },
  payment: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  
  // PayPal specific fields
  paypal_order_id: { type: String },
  paypal_payment_id: { type: String },
  paypal_payer_id: { type: String },
  
  // Coupon related fields
  couponCode: { type: String, default: null },
  couponDiscount: { type: Number, default: 0 },
  couponType: { type: String, enum: ['percentage', 'fixed'], default: null }
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel