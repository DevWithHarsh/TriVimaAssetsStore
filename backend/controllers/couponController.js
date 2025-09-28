import couponModel from '../models/couponModel.js';
import productModel from '../models/productModel.js';

// Add new coupon
const addCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      expiryDate,
      usageLimit,
      applicableCategories,
      excludedCategories
    } = req.body;

    // Validate required fields
    if (!code || !description || !discountType || !discountValue || !expiryDate) {
      return res.json({ success: false, message: "All required fields must be filled" });
    }

    // Validate discount value
    if (discountType === 'percentage' && discountValue > 100) {
      return res.json({ success: false, message: "Percentage discount cannot exceed 100%" });
    }

    // Check if coupon code already exists
    const existingCoupon = await couponModel.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.json({ success: false, message: "Coupon code already exists" });
    }

    // Validate expiry date
    if (new Date(expiryDate) <= new Date()) {
      return res.json({ success: false, message: "Expiry date must be in the future" });
    }

    const couponData = {
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minimumOrderAmount: Number(minimumOrderAmount) || 0,
      maximumDiscountAmount: discountType === 'percentage' ? Number(maximumDiscountAmount) || null : null,
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit ? Number(usageLimit) : null,
      applicableCategories: applicableCategories || [],
      excludedCategories: excludedCategories || []
    };

    const coupon = new couponModel(couponData);
    await coupon.save();

    res.json({ success: true, message: "Coupon added successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all coupons
const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdDate: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove coupon
const removeCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    await couponModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Coupon removed successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Update coupon status (activate/deactivate)
const updateCouponStatus = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    await couponModel.findByIdAndUpdate(id, { isActive });
    res.json({ success: true, message: `Coupon ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Validate and apply coupon
const applyCoupon = async (req, res) => {
  try {
    const { code, cartItems, userId } = req.body;

    if (!code) {
      return res.json({ success: false, message: "Please enter a coupon code" });
    }

    // Find coupon
    const coupon = await couponModel.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid or expired coupon code" });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ success: false, message: "Coupon usage limit exceeded" });
    }

    // Calculate cart amount and validate items
    let cartAmount = 0;
    let applicableAmount = 0;
    const cartProducts = [];

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = await productModel.findById(itemId);
        if (product) {
          const itemTotal = product.price * cartItems[itemId];
          cartAmount += itemTotal;
          
          // Check if product category is applicable for coupon
          const isApplicable = checkCategoryApplicability(product.category, coupon);
          if (isApplicable) {
            applicableAmount += itemTotal;
          }
          
          cartProducts.push({
            ...product.toObject(),
            quantity: cartItems[itemId],
            isApplicable
          });
        }
      }
    }

    // Check minimum order amount
    if (cartAmount < coupon.minimumOrderAmount) {
      return res.json({ 
        success: false, 
        message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (applicableAmount * coupon.discountValue) / 100;
      if (coupon.maximumDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, applicableAmount);
    }

    discountAmount = Math.round(discountAmount);

    res.json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        applicableAmount
      }
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Helper function to check category applicability
const checkCategoryApplicability = (productCategory, coupon) => {
  // If excluded categories exist and product category is in excluded list
  if (coupon.excludedCategories.length > 0 && coupon.excludedCategories.includes(productCategory)) {
    return false;
  }
  
  // If applicable categories exist and product category is not in applicable list
  if (coupon.applicableCategories.length > 0 && !coupon.applicableCategories.includes(productCategory)) {
    return false;
  }
  
  return true;
};

// Remove coupon (for frontend)
const removeCouponFromCart = async (req, res) => {
  try {
    res.json({ success: true, message: "Coupon removed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get active coupons for frontend display (optional)
const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({
      isActive: true,
      expiryDate: { $gt: new Date() }
    }).select('code description discountType discountValue minimumOrderAmount expiryDate');
    
    res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Update coupon usage count (called when order is placed)
const incrementCouponUsage = async (couponCode) => {
  try {
    if (couponCode) {
      await couponModel.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }
  } catch (error) {
    console.error('Error incrementing coupon usage:', error);
  }
};

export { 
  addCoupon, 
  listCoupons, 
  removeCoupon, 
  updateCouponStatus, 
  applyCoupon, 
  removeCouponFromCart, 
  getActiveCoupons,
  incrementCouponUsage 
};