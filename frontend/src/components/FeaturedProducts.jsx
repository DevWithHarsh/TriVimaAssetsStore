import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const FeaturedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('Hot & New');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { products, currency, navigate } = useContext(ShopContext);

  // Category buttons configuration
  const categories = [
    { id: 'topBundles', label: 'Top Bundles', icon: '📦', color: 'purple' },
    { id: 'hotNew', label: 'Hot & New', icon: '🔥', color: 'orange' },
    { id: 'mostPopular', label: 'Most Popular', icon: '💖', color: 'red' },
    { id: 'startHere', label: 'Start Here', icon: '👍', color: 'blue' },
  ];

  // Filter products based on selected category
  useEffect(() => {
    if (!products || products.length === 0) return;

    let filtered = [];

    switch (selectedCategory) {
      case 'Top Bundles':
        filtered = products.filter(product => product.tag === 'topBundles');
        break;
      case 'Hot & New':
        filtered = products.filter(product => product.tag === 'hotNew');
        break;
      case 'Most Popular':
        filtered = products.filter(product => product.tag === 'mostPopular');
        break;
      case 'Start Here':
        filtered = products.filter(product => product.tag === 'startHere');
        break;
      default:
        filtered = products;
    }

    // Limit to 4 products
    setFilteredProducts(filtered.slice(0, 4));
  }, [selectedCategory, products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/categories');
  };

  return (
    <div className="py-12 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.label)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300
                ${selectedCategory === category.label
                  ? `bg-${category.color}-600 text-white shadow-lg scale-105`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }
              `}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}

          {/* View All Products Button */}
          <div className="flex items-center gap-2 text-gray-400">
            <span>or</span>
            <button
              onClick={handleViewAllProducts}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              View All Products
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              >
                {/* Product Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* New Course Badge */}
                  {index === 0 && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded transform rotate-[-15deg]">
                        NEW COURSE
                      </div>
                    </div>
                  )}

                  {/* Category Icons */}
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                        <span className="text-xs">🎮</span>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">U</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Course Details */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center"></span>
                      <span className="text-xs">📚</span>
                    </div>
                    <span>Course</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center"></span>
                    <span className="text-xs">📊</span>
                  </div>
                  <span>Beginner</span>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-3 px-4">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      R
                    </div>
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      S
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.instructor || 'Expert Instructor'}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-teal-400">
                      {currency}{product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {currency}{Math.floor(product.price * 1.5)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    ⭐ {(4.0 + Math.random()).toFixed(1)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-400 mb-4">
                No products found in the "{selectedCategory}" category.
              </p>
              <button
                onClick={() => setSelectedCategory('Hot & New')}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors"
              >
                View Hot & New
              </button>
            </div>
          )}
        </div>

        {/* Show More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleViewAllProducts}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore More {selectedCategory} Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
