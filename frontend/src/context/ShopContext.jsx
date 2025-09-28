import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '₹';
  let delivery_fee = 0;

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('')
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Coupon related state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const addToWishlist = async itemId => {
    if (!wishlistItems.includes(itemId)) {
      setWishlistItems(prev => [...prev, itemId]);
      toast.success("Added to wishlist!");
      if (token) {
        await axios.post(`${backendUrl}/api/user/wishlist/add`, { itemId }, { headers: { token } });
      }
    }
  };

  const removeFromWishlist = async itemId => {
    setWishlistItems(prev => prev.filter(id => id !== itemId));
    toast.info("Removed from wishlist!");
    if (token) {
      await axios.post(`${backendUrl}/api/user/wishlist/remove`, { itemId }, { headers: { token } });
    }
  };

  const getUserWishlist = async token => {
    const res = await axios.post(`${backendUrl}/api/user/wishlist`, {}, { headers: { token } });
    if (res.data.success) setWishlistItems(res.data.wishlist);
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    // Reset coupon when cart changes
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      toast.info("Coupon removed due to cart changes");
    }

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', { itemId }, { headers: { token } })
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.price * cartItems[items];
      }
    }
    return totalAmount;
  };

  // Get cart amount after coupon discount
  const getCartAmountAfterDiscount = () => {
    const originalAmount = getCartAmount();
    return originalAmount - couponDiscount;
  };

  let subtotal = getCartAmountAfterDiscount();
  if (getCartAmount() < 1000) { // Only apply shipping for orders below ₹1000
    delivery_fee = 0;
  } else {
    delivery_fee = 0;
  }

  const updateQuantity = async (itemID, quantity) => {
    if (!itemID) {
      console.error("❌ updateQuantity called without itemID");
      return;
    }

    let cartData = structuredClone(cartItems);
    cartData[itemID] = quantity;
    setCartItems(cartData);

    // Reset coupon when cart changes
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      toast.info("Coupon removed due to cart changes");
    }

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, {
          itemId: itemID,
          quantity
        }, {
          headers: { token }
        });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Apply coupon function
  const applyCoupon = async (couponCode) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/apply`,
        { 
          code: couponCode,
          cartItems,
          userId: token 
        },
        { headers: { token } }
      );

      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        setCouponDiscount(response.data.coupon.discountAmount);
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: error?.response?.data?.message || "Failed to apply coupon" };
    }
  };

  // Remove coupon function
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getProductsData()
  }, [])

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!token && localToken) {
      setToken(localToken);
      getUserCart(localToken);
      getUserWishlist(localToken);
    }
  }, []);

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, setCartItems, addToCart,
    getCartCount, updateQuantity, getCartAmount, getCartAmountAfterDiscount,
    navigate, backendUrl,
    setToken, token,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    // Coupon related functions and state
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    setAppliedCoupon,
    setCouponDiscount
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;