import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

function CartTotal({ appliedCoupon }) {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  
  // Calculate discount amount
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  
  // Calculate total after discount
  const discountedSubtotal = subtotal - discountAmount;
  const total = discountedSubtotal === 0 ? 0 : discountedSubtotal + delivery_fee;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {subtotal}.00</p>
        </div>
        
        {/* Coupon Discount Row */}
        {appliedCoupon && (
          <>
            <hr />
            <div className='flex justify-between text-green-600'>
              <p>Coupon Discount ({appliedCoupon.code})</p>
              <p>- {currency} {discountAmount}.00</p>
            </div>
          </>
        )}
        
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fees</p>
          <div className="text-right">
            <p className="text-xs text-gray-500">*Only Applied on orders below ₹1000</p>
            <p>{currency} {delivery_fee}.00</p>
          </div>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency} {total}.00</b>
        </div>
        
        {appliedCoupon && (
          <div className='mt-2 text-xs text-green-600'>
            <p>You saved {currency} {discountAmount}.00 with coupon {appliedCoupon.code}!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartTotal;