import userModel from "../models/userModel.js";

// Add to cart
const addToCart = async (req, res) => {
  const { itemId } = req.body;
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);
    const currentCart = user.cartData || {};

    currentCart[itemId] = (currentCart[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData: currentCart });
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update cart item quantity
const updateCart = async (req, res) => {
  const { itemId, quantity, userId } = req.body;

  try {
    const user = await userModel.findById(userId);
    const currentCart = user.cartData || {};

    if (quantity === 0) {
      delete currentCart[itemId];
    } else {
      currentCart[itemId] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData: currentCart });
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get cart
const getCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);
    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getCart, clearCart };
