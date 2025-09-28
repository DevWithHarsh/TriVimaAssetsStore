import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  discountType: { 
    type: String, 
    required: true, 
    enum: ['percentage', 'fixed'] 
  },
  discountValue: { 
    type: Number, 
    required: true,
    min: 0
  },
  minimumOrderAmount: { 
    type: Number, 
    default: 0 
  },
  maximumDiscountAmount: { 
    type: Number, 
    default: null // Only for percentage coupons
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  usageLimit: { 
    type: Number, 
    default: null // null means unlimited
  },
  usedCount: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  applicableCategories: [{ 
    type: String 
  }], // Empty array means applicable to all categories
  excludedCategories: [{ 
    type: String 
  }],
  createdDate: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: { 
    type: String, 
    default: 'admin' 
  }
});

// Add index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ isActive: 1 });

const couponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema);

export default couponModel;