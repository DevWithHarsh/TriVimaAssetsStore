import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const ListCoupons = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/coupon/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCoupons(response.data.coupons);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const toggleCouponStatus = async (id, currentStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/update-status`,
        { id, isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) <= new Date();
  };

  const getStatusBadge = (coupon) => {
    if (isExpired(coupon.expiryDate)) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Expired</span>;
    }
    if (!coupon.isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Limit Reached</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) {
    return <div className="p-8">Loading coupons...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Coupons</h2>
        <div className="text-sm text-gray-600">
          Total Coupons: {coupons.length}
        </div>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 text-lg">No coupons found</p>
          <p className="text-gray-400 text-sm mt-2">Create your first coupon to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Header */}
          <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 py-3 px-5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
            <span>Code</span>
            <span>Type & Value</span>
            <span>Min Order</span>
            <span>Usage</span>
            <span>Expiry</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Coupon Cards */}
          {coupons.map((coupon, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              {/* Mobile Layout */}
              <div className="lg:hidden p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-blue-600">{coupon.code}</h3>
                    <p className="text-gray-600 text-sm">{coupon.description}</p>
                  </div>
                  {getStatusBadge(coupon)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Discount:</span>
                    <p className="font-semibold">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}%` 
                        : `${currency}${coupon.discountValue}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Min Order:</span>
                    <p className="font-semibold">{currency}{coupon.minimumOrderAmount}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Usage:</span>
                    <p className="font-semibold">
                      {coupon.usedCount}/{coupon.usageLimit || '∞'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Expires:</span>
                    <p className="font-semibold text-xs">{formatDate(coupon.expiryDate)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      coupon.isActive 
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => removeCoupon(coupon._id)}
                    className="flex-1 py-2 px-4 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 py-4 px-5 items-center text-sm">
                <div>
                  <p className="font-bold text-blue-600">{coupon.code}</p>
                  <p className="text-gray-500 text-xs truncate">{coupon.description}</p>
                </div>
                
                <div>
                  <p className="font-semibold">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}%` 
                      : `${currency}${coupon.discountValue}`}
                  </p>
                  {coupon.discountType === 'percentage' && coupon.maximumDiscountAmount && (
                    <p className="text-xs text-gray-500">Max: {currency}{coupon.maximumDiscountAmount}</p>
                  )}
                </div>
                
                <p className="text-gray-700">{currency}{coupon.minimumOrderAmount}</p>
                
                <div>
                  <p className="font-semibold">{coupon.usedCount}/{coupon.usageLimit || '∞'}</p>
                  {coupon.usageLimit && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-600">{formatDate(coupon.expiryDate)}</p>
                
                <div className="flex justify-center">
                  {getStatusBadge(coupon)}
                </div>
                
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      coupon.isActive 
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                    title={coupon.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => removeCoupon(coupon._id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCoupons;