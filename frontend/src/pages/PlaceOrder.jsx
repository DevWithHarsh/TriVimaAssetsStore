import React, { useContext, useState } from "react";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PlaceOrder = () => {
    const [showPayPal, setShowPayPal] = useState(false);
    const [orderData, setOrderData] = useState(null);
    
    const {
        navigate,
        backendUrl,
        token,
        cartItems,
        setCartItems,
        getCartAmount,
        delivery_fee,
        products,
    } = useContext(ShopContext);

    const location = useLocation();
    const { appliedCoupon } = location.state || {};

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    // PayPal configuration
    const paypalOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture"
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!token) {
            toast.error("Please login to place an order");
            return;
        }

        try {
            let orderItems = [];
            for (const items in cartItems) {
                if (cartItems[items] > 0) {
                    const itemInfo = structuredClone(
                        products.find((product) => product._id === items)
                    );
                    if (itemInfo) {
                        itemInfo.quantity = cartItems[items];
                        orderItems.push(itemInfo);
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.error("No items in cart");
                return;
            }

            // Calculate amounts
            const originalAmount = getCartAmount() + delivery_fee;
            const calculatedFinalAmount = appliedCoupon
                ? originalAmount - appliedCoupon.discountAmount
                : originalAmount;

            const preparedOrderData = {
                address: formData,
                items: orderItems,
                amount: calculatedFinalAmount,
                paymentMethod: "PayPal",
                couponCode: appliedCoupon?.code || null,
                couponDiscount: appliedCoupon?.discountAmount || 0,
                originalAmount: originalAmount,
                couponType: appliedCoupon?.discountType || null,
            };

            console.log('Prepared order data:', preparedOrderData);
            setOrderData(preparedOrderData);
            setShowPayPal(true);

        } catch (error) {
            console.error("Order preparation error:", error);
            toast.error("Order preparation failed. Please try again.");
        }
    };

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h[80vh] border-t"
            >
                {/* Left side - Billing Information */}
                <div className="flex flex-col gap-4 w-full sm:max-[480px]">
                    <div className="text-xl sm:text-2xl my-3">
                        <Title text1={"BILLING"} text2={"INFORMATION"} />
                    </div>
                    
                    <div className="flex gap-3">
                        <input
                            required
                            onChange={onChangeHandler}
                            name="firstName"
                            value={formData.firstName}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="First Name"
                        />
                        <input
                            required
                            onChange={onChangeHandler}
                            name="lastName"
                            value={formData.lastName}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="Last Name"
                        />
                    </div>

                    <input
                        required
                        onChange={onChangeHandler}
                        name="email"
                        value={formData.email}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="email"
                        placeholder="Email Address"
                    />
                    
                    <input
                        required
                        onChange={onChangeHandler}
                        name="street"
                        value={formData.street}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="Street Address"
                    />

                    <div className="flex gap-3">
                        <input
                            required
                            onChange={onChangeHandler}
                            name="city"
                            value={formData.city}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="City"
                        />
                        <input
                            required
                            onChange={onChangeHandler}
                            name="state"
                            value={formData.state}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="State"
                        />
                    </div>

                    <div className="flex gap-3">
                        <input
                            required
                            onChange={onChangeHandler}
                            name="zipcode"
                            value={formData.zipcode}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="number"
                            placeholder="Zipcode"
                        />
                        <input
                            required
                            onChange={onChangeHandler}
                            name="country"
                            value={formData.country}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="Country"
                        />
                    </div>

                    <input
                        required
                        onChange={onChangeHandler}
                        name="phone"
                        value={formData.phone}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="number"
                        placeholder="Phone"
                    />
                </div>

                {/* Right side - Payment */}
                <div className="mt-8">
                    <div className="mt-8 min-w-80">
                        <CartTotal appliedCoupon={appliedCoupon} />
                    </div>

                    <div className="mt-12">
                        <Title text1={"PAYMENT"} text2={"METHOD"} />
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-blue-800 text-sm">
                                <strong>Digital Assets:</strong> Since you're purchasing digital 3D assets,
                                payment must be completed online before download access is granted.
                            </p>
                        </div>

                        {/* PayPal Payment Method - Always Selected */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center justify-between flex-1 max-w-md gap-4 border-2 border-blue-500 bg-blue-50 rounded-xl p-4 shadow-md">
                                <div className="w-4 h-4 flex-shrink-0 bg-blue-500 border-2 border-blue-600 rounded-full"></div>
                                <div className="flex-1 flex justify-center items-center">
                                    <span className="text-blue-600 font-bold text-lg">PayPal</span>
                                </div>
                            </div>
                        </div>

                        {/* PayPal Buttons */}
                        {showPayPal && orderData && (
                            <div className="mb-6">
                                <PayPalButtons
                                    style={{ 
                                        layout: "vertical",
                                        color: "blue",
                                        shape: "rect",
                                        label: "paypal"
                                    }}
                                    createOrder={async () => {
                                        try {
                                            const response = await axios.post(
                                                backendUrl + "/api/order/paypal",
                                                orderData,
                                                { headers: { token } }
                                            );
                                            
                                            if (response.data.success) {
                                                return response.data.paypalOrderId;
                                            } else {
                                                throw new Error(response.data.message);
                                            }
                                        } catch (error) {
                                            console.error("PayPal order creation error:", error);
                                            toast.error("Failed to create PayPal order");
                                            throw error;
                                        }
                                    }}
                                    onApprove={async (data) => {
                                        try {
                                            const response = await axios.post(
                                                backendUrl + "/api/order/verifyPayPal",
                                                {
                                                    paypalOrderId: data.orderID,
                                                },
                                                { headers: { token } }
                                            );

                                            if (response.data.success) {
                                                await axios.post(backendUrl + "/api/cart/clear", {}, { headers: { token } });
                                                setCartItems({});
                                                navigate("/orders");
                                                toast.success("Payment Successful! You can now download your 3D assets.");
                                            } else {
                                                toast.error("Payment verification failed");
                                            }
                                        } catch (error) {
                                            console.error("PayPal verification error:", error);
                                            toast.error("Payment processing failed");
                                        }
                                    }}
                                    onError={(err) => {
                                        console.error("PayPal error:", err);
                                        toast.error("PayPal payment failed");
                                    }}
                                    onCancel={() => {
                                        setShowPayPal(false);
                                        toast.info("Payment cancelled");
                                    }}
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        {!showPayPal && (
                            <div className="w-full text-end mt-8">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-16 py-3 text-sm hover:bg-blue-700 transition-colors rounded-md font-medium"
                                >
                                    PROCEED WITH PAYPAL
                                </button>
                            </div>
                        )}

                        {/* Alternative: Show info message when PayPal buttons are visible */}
                        {showPayPal && (
                            <div className="text-center mt-4">
                                <p className="text-gray-600 text-sm">
                                    Complete your payment using the PayPal buttons above
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </PayPalScriptProvider>
    );
};

export default PlaceOrder;