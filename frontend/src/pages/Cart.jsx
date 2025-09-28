import React, { useContext, useEffect, useState } from "react";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from 'axios';

function Cart() {
  const { products, currency, cartItems, updateQuantity, navigate, backendUrl, token, getCartAmount } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        if (cartItems[items] > 0) {
          tempData.push({ _id: items, quantity: cartItems[items] });
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (!token) {
      toast.error("Please login to apply coupon");
      return;
    }

    setCouponLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/apply`,
        {
          code: couponCode.trim(),
          cartItems,
          userId: token
        },
        { headers: { token } }
      );

      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info("Coupon removed");
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(product => product._id === item._id);
          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) => {
                  if (e.target.value === '' || e.target.value === '0') {
                    return null;
                  }
                  const newQuantity = Number(e.target.value);
                  const product = products.find(p => p._id === item._id);
                  if (product && newQuantity > product.stock) {
                    toast.error(`Only ${product.stock} units available`);
                    e.target.value = product.stock;
                    updateQuantity(item._id, product.stock);
                  } else {
                    updateQuantity(item._id, newQuantity);
                  }
                }}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                max={products.find(p => p._id === item._id)?.stock || 1}
                defaultValue={item.quantity}
              />

              <img
                onClick={() => updateQuantity(item._id, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          {/* Coupon Section */}
          <div className="mb-6 p-4 rounded-lg border border-black-700">
            <h3 className="text-lg font-medium mb-3">Have a Coupon Code?</h3>

            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md uppercase"
                  maxLength="20"
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-green-800">Coupon Applied: {appliedCoupon.code}</p>
                    <p className="text-sm text-green-600">
                      Discount: {appliedCoupon.discountType === 'percentage'
                        ? `${appliedCoupon.discountValue}%`
                        : `${currency}${appliedCoupon.discountValue}`}
                      = {currency}{appliedCoupon.discountAmount}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <CartTotal appliedCoupon={appliedCoupon} />
          <div className="w-full text-end">
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  toast.error("Please login before placing an order.");
                  navigate("/login");
                  return;
                }

                // Check stock availability for all items in cart
                let hasStockIssue = false;
                for (const items in cartItems) {
                  if (cartItems[items] > 0) {
                    const product = products.find(p => p._id === items);
                    if (product) {
                      if (product.stock < cartItems[items]) {
                        toast.error(`Only ${product.stock} units available for ${product.name}`);
                        hasStockIssue = true;
                        break;
                      }
                    }
                  }
                }

                if (!hasStockIssue) {
                  // If stock is available, proceed to checkout
                  navigate("/place-order", {
                    state: {
                      appliedCoupon,
                      discountedTotal:
                        (getCartAmount() - (appliedCoupon?.discountAmount || 0)),
                      couponDiscount: appliedCoupon?.discountAmount || 0,
                      couponCode: appliedCoupon?.code || null
                    }
                  });
                }
              }}
              className="bg-black text-sm my-8 px-8 py-3 text-white"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;