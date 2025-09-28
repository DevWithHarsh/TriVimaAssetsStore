import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const AddCoupon = ({ token }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderAmount: '',
    maximumDiscountAmount: '',
    expiryDate: '',
    usageLimit: '',
    applicableCategories: [],
    excludedCategories: []
  });

  const categories = [
    "Antique & Spiritual Collection",
    "Showpieces & Décor",
    "Wall & Home Decoration",
    "Soft Furnishings",
    "Artificial Flowers & Plants",
    "Festive & Pooja Décor",
    "Interior Designing Services"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category, type) => {
    setFormData(prev => {
      const currentCategories = prev[type];
      const isSelected = currentCategories.includes(category);
      
      return {
        ...prev,
        [type]: isSelected 
          ? currentCategories.filter(cat => cat !== category)
          : [...currentCategories, category]
      };
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.code || !formData.description || !formData.discountValue || !formData.expiryDate) {
        toast.error('Please fill all required fields');
        return;
      }

      if (formData.discountType === 'percentage' && formData.discountValue > 100) {
        toast.error('Percentage discount cannot exceed 100%');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/coupon/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setFormData({
          code: '',
          description: '',
          discountType: 'percentage',
          discountValue: '',
          minimumOrderAmount: '',
          maximumDiscountAmount: '',
          expiryDate: '',
          usageLimit: '',
          applicableCategories: [],
          excludedCategories: []
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Add Coupon Error:', error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4 max-w-4xl">
      <div className="w-full mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Coupon</h2>
        <p className="text-gray-600">Create discount coupons for your customers</p>
      </div>

      {/* Basic Information */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coupon Code */}
        <div>
          <p className="mb-2 font-medium">Coupon Code *</p>
          <input
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase"
            type="text"
            placeholder="e.g., SAVE20"
            maxLength="20"
            required
          />
        </div>

        {/* Discount Type */}
        <div>
          <p className="mb-2 font-medium">Discount Type *</p>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2 font-medium">Description *</p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Describe this coupon..."
          rows="3"
          required
        />
      </div>

      {/* Discount Value and Constraints */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="mb-2 font-medium">
            Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
          </p>
          <input
            name="discountValue"
            value={formData.discountValue}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="number"
            min="0"
            max={formData.discountType === 'percentage' ? "100" : undefined}
            placeholder={formData.discountType === 'percentage' ? '20' : '100'}
            required
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Minimum Order Amount (₹)</p>
          <input
            name="minimumOrderAmount"
            value={formData.minimumOrderAmount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="number"
            min="0"
            placeholder="500"
          />
        </div>

        {formData.discountType === 'percentage' && (
          <div>
            <p className="mb-2 font-medium">Maximum Discount (₹)</p>
            <input
              name="maximumDiscountAmount"
              value={formData.maximumDiscountAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              type="number"
              min="0"
              placeholder="200"
            />
          </div>
        )}
      </div>

      {/* Expiry and Usage */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="mb-2 font-medium">Expiry Date *</p>
          <input
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Usage Limit</p>
          <input
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="number"
            min="1"
            placeholder="Leave empty for unlimited"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="w-full">
        <p className="mb-3 font-medium">Applicable Categories (Leave empty for all categories)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
          {categories.map((category, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.applicableCategories.includes(category)}
                onChange={() => handleCategoryChange(category, 'applicableCategories')}
                className="rounded"
              />
              <span className="truncate">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Excluded Categories */}
      <div className="w-full">
        <p className="mb-3 font-medium">Excluded Categories (Optional)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
          {categories.map((category, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.excludedCategories.includes(category)}
                onChange={() => handleCategoryChange(category, 'excludedCategories')}
                className="rounded"
              />
              <span className="truncate">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors mt-4"
      >
        CREATE COUPON
      </button>
    </form>
  );
};

export default AddCoupon;