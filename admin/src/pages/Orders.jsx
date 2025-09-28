// admin/src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/remove",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Helper function to get payment method badge style
  const getPaymentMethodBadge = (paymentMethod) => {
    const baseClasses = "ml-1 px-2 py-1 rounded-full text-xs font-semibold";
    
    switch (paymentMethod) {
      case 'PayPal':
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
      case 'Razorpay':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  // Helper function to get transaction ID
  const getTransactionId = (order) => {
    if (order.paypal_payment_id) {
      return order.paypal_payment_id;
    } else if (order.razorpay_payment_id) {
      return order.razorpay_payment_id;
    }
    return null;
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="px-4 py-6 sm:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold mb-6 text-gray-800">Admin Orders</h3>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start border border-gray-200 bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Order Icon */}
            <img
              className="w-12 h-12 object-contain"
              src={assets.parcel_icon}
              alt="parcel"
            />

            {/* Customer + Address */}
            <div className="text-sm text-gray-700">
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.name} × {item.quantity}
                    {i !== order.items.length - 1 ? "," : ""}
                  </p>
                ))}
              </div>
              <p className="mt-4 font-medium text-gray-800">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="text-xs mt-1 text-gray-600">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country} - {order.address.zipcode}
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                📞 {order.address.phone}
              </p>
            </div>

            {/* Order Info */}
            <div className="text-sm text-gray-700 space-y-1">
              <p>🧾 Items: {order.items.length}</p>
              
              {/* Enhanced Payment Method Display */}
              <div className="flex items-center">
                <span>💳 Method:</span>
                <span className={getPaymentMethodBadge(order.paymentMethod)}>
                  {order.paymentMethod}
                </span>
              </div>

              {/* Enhanced Payment Status */}
              <div className="space-y-1">
                <div className="flex items-center">
                  <span>💰 Payment:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      order.payment
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {order.payment ? "Paid" : "Pending"}
                  </span>
                </div>
                
                {/* Show Transaction ID if payment is completed */}
                {order.payment && getTransactionId(order) && (
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Transaction ID:</span>
                    <br />
                    <span className="font-mono bg-gray-50 px-1 py-0.5 rounded break-all">
                      {getTransactionId(order).length > 20 
                        ? `${getTransactionId(order).substring(0, 20)}...` 
                        : getTransactionId(order)
                      }
                    </span>
                  </div>
                )}
              </div>

              <p>📅 Date: {new Date(order.date).toLocaleDateString()}</p>
              
              {/* Show coupon discount if applied */}
              {order.couponDiscount > 0 && (
                <div className="text-xs bg-yellow-50 p-2 rounded border border-yellow-200">
                  <p className="font-medium text-yellow-800">Coupon Applied:</p>
                  <p className="text-yellow-700">
                    Code: {order.couponCode || 'N/A'}
                  </p>
                  <p className="text-yellow-700">
                    Discount: {currency}{order.couponDiscount}
                  </p>
                </div>
              )}
              
              <div className="border-t pt-2 mt-2">
                <p className="text-lg font-bold text-gray-800">
                  Total: {currency}{order.amount}
                </p>
                {order.couponDiscount > 0 && (
                  <p className="text-xs text-gray-500">
                    (Original: {currency}{order.originalAmount || order.amount})
                  </p>
                )}
              </div>
            </div>

            {/* Status Dropdown + Delete */}
            <div className="flex flex-col gap-3">
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Processing">Processing</option>
                <option value="Digital Asset Ready">Digital Asset Ready</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => deleteOrder(order._id)}
                className="text-red-500 hover:text-red-600 font-bold text-xl cursor-pointer text-center py-2 px-4 rounded-md hover:bg-red-50 transition-colors"
                title="Delete Order"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm">Orders will appear here once customers make purchases</p>
        </div>
      )}
    </div>
  );
};

export default Orders;