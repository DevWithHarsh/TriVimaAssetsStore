import React, { useContext } from 'react';
import ProductItem from '../components/ProductItem';
import { ShopContext } from '../context/ShopContext';

const Wishlist = () => {
  const {
    products, wishlistItems,
    removeFromWishlist, addToCart, currency
  } = useContext(ShopContext);

  const items = wishlistItems
    .map(pid => products.find(p => p._id === pid))
    .filter(Boolean);

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      {items.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="">
              <ProductItem
                name={item.name}
                id={item._id}
                price={item.price}
                image={Array.isArray(item.image) ? item.image[0] : item.image}
                stock={item.stock}
              />
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
