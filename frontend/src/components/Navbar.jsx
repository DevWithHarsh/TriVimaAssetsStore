import React, { useContext, useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const profileRef = useRef();
  const productsRef = useRef();
  const { wishlistItems } = useContext(ShopContext);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setShowProfileMenu(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setShowProductsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#1a1d24] text-white px-4 sm:px-8 py-4 sticky top-0 z-50 border-b border-gray-700">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3dd68c] rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">3D</span>
          </div>
          <span className="text-xl font-bold hidden sm:block">3D Assets Store</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {/* Products Dropdown */}
          <div className="relative" ref={productsRef}>
            <button
              onMouseEnter={() => setShowProductsDropdown(true)}
              className="flex items-center gap-1 text-gray-300 hover:text-[#3dd68c] transition-colors"
            >
              Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showProductsDropdown && (
              <div 
                className="absolute top-full left-0 mt-2 w-80 bg-[#2a2d35] border border-gray-600 rounded-lg shadow-xl z-50"
                onMouseLeave={() => setShowProductsDropdown(false)}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button className="bg-[#3dd68c] text-black px-3 py-1 rounded text-sm font-medium">
                      View all products
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-xs">U</span>
                        </div>
                        <span className="text-sm">Unreal Engine Assets</span>
                        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                          <span className="text-xs">U</span>
                        </div>
                        <span className="text-sm">Unity Assets</span>
                        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-xs">B</span>
                        </div>
                        <span className="text-sm">Blender Models</span>
                        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/community" className="text-gray-300 hover:text-[#3dd68c] transition-colors">
            Community
          </NavLink>
          <NavLink to="/help" className="text-gray-300 hover:text-[#3dd68c] transition-colors">
            Help
          </NavLink>
          <NavLink to="/about" className="text-gray-300 hover:text-[#3dd68c] transition-colors">
            About
          </NavLink>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 hover:bg-gray-700 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3dd68c] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            {token ? (
              <>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#2a2d35] border border-gray-600 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/orders');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          navigate('/write-review');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                      >
                        Write Review
                      </button>
                      <button
                        onClick={() => {
                          navigate('/my-reviews');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                      >
                        My Reviews
                      </button>
                      <hr className="my-2 border-gray-600" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-700 transition-colors text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#3dd68c] text-black px-4 py-2 rounded font-medium text-sm hover:bg-[#2bc77a] transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setVisible(true)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-[#1a1d24] border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Menu</span>
                <button
                  onClick={() => setVisible(false)}
                  className="p-2 hover:bg-gray-700 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <NavLink 
                to="/categories" 
                onClick={() => setVisible(false)}
                className="block py-2 text-gray-300 hover:text-[#3dd68c] transition-colors"
              >
                Products
              </NavLink>
              <NavLink 
                to="/community" 
                onClick={() => setVisible(false)}
                className="block py-2 text-gray-300 hover:text-[#3dd68c] transition-colors"
              >
                Community
              </NavLink>
              <NavLink 
                to="/help" 
                onClick={() => setVisible(false)}
                className="block py-2 text-gray-300 hover:text-[#3dd68c] transition-colors"
              >
                Help
              </NavLink>
              <NavLink 
                to="/about" 
                onClick={() => setVisible(false)}
                className="block py-2 text-gray-300 hover:text-[#3dd68c] transition-colors"
              >
                About
              </NavLink>
              
              {token && (
                <>
                  <hr className="border-gray-600" />
                  <NavLink 
                    to="/orders" 
                    onClick={() => setVisible(false)}
                    className="block py-2 text-gray-300 hover:text-[#3dd68c] transition-colors"
                  >
                    My Orders
                  </NavLink>
                  <NavLink 
                    to="/write-review" 
                    onClick={() => setVisible(false)}
                    className="block py-2 text-gray-300 hover:text-[#3dd68c] transition-colors"
                  >
                    Write Review
                  </NavLink>
                  <NavLink 
                    to="/my-reviews" 
                    onClick={() => setVisible(false)}
                    className="block py-2 text-gray-300 hover:text-[#3dd68c] transition-colors"
                  >
                    My Reviews
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setVisible(false);
                    }}
                    className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;