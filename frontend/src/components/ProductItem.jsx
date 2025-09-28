import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductItem = ({ id, image, name, price, stock, zipFile, zipFileType, averageRating, totalReviews }) => {
  const { addToCart, currency, addToWishlist, removeFromWishlist, wishlistItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = wishlistItems.includes(id);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(id);
      toast.success("Added to cart");
      navigate('/cart');
    } catch (err) {
      toast.error("Failed to add to cart");
      console.log(err);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isWishlisted ? removeFromWishlist(id) : addToWishlist(id);
  };

  const getAssetTypeIcon = () => {
    if (!zipFile) return null;
    
    if (name.toLowerCase().includes('unity')) return '🔷';
    if (name.toLowerCase().includes('unreal')) return '🔷';
    if (name.toLowerCase().includes('blender')) return '🎨';
    return '📦';
  };

  const getAssetTypeBadge = () => {
    if (!zipFile) return null;
    
    if (name.toLowerCase().includes('unity')) return 'Unity';
    if (name.toLowerCase().includes('unreal')) return 'Unreal';
    if (name.toLowerCase().includes('blender')) return 'Blender';
    return '3D Asset';
  };

  return (
    <div 
      className="bg-[#2a2d35] rounded-lg overflow-hidden border border-gray-700 hover:border-[#3dd68c] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          
          {/* Asset Type Badge */}
          {zipFile && (
            <div className="absolute top-3 left-3 bg-[#3dd68c] text-black px-2 py-1 rounded text-xs font-bold">
              {getAssetTypeIcon()} {getAssetTypeBadge()}
            </div>
          )}
          
          {/* Stock Status */}
          {stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <span className="text-red-400 font-bold">OUT OF STOCK</span>
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
            }`}
          >
            <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Hover Overlay */}
          {isHovered && stock > 0 && (
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              {/* <button
                onClick={handleBuyNow}
                className="bg-[#3dd68c] text-black px-4 py-2 rounded font-bold hover:bg-[#2bc77a] transition-colors"
              >
                Add to Cart
              </button> */}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 line-clamp-2 leading-tight">
            {name}
          </h3>
          
          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-400 text-xs">
                {averageRating} ({totalReviews})
              </span>
            </div>
          )}
          
          {/* Price and Download Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#3dd68c] font-bold text-lg">
                  {currency}{price}
                </span>
              </div>
              
              {zipFile && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Instant Download</span>
                </div>
              )}
            </div>
            
            {/* Asset Features */}
            {zipFile && (
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                  3D Model
                </span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                  {zipFileType === 'drive_link' ? 'Cloud' : 'Direct'}
                </span>
              </div>
            )}
            
            {stock > 0 ? (
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#3dd68c] text-black py-2 px-4 rounded font-semibold hover:bg-[#2bc77a] transition-colors"
              >
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-600 text-gray-400 py-2 px-4 rounded font-semibold cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;