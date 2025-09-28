import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl, setCartItems } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password,
        });

        if (response.data.success) {
          const receivedToken = response.data.token;
          setToken(receivedToken);
          localStorage.setItem('token', receivedToken);
          toast.success('Account created successfully!');
          await fetchUserCart(receivedToken);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', {
          email,
          password,
        });

        if (response.data.success) {
          const receivedToken = response.data.token;
          setToken(receivedToken);
          localStorage.setItem('token', receivedToken);
          toast.success('Welcome back!');
          await fetchUserCart(receivedToken);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCart = async (authToken) => {
    try {
      const cartRes = await axios.post(
        backendUrl + '/api/cart/get',
        {},
        {
          headers: { token: authToken },
        }
      );
      if (cartRes.data.success) {
        setCartItems(cartRes.data.cartData || {});
      }
    } catch (error) {
      console.log('Cart fetch failed:', error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#1a1d24] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-[#3dd68c] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-2xl">3D</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentState === 'Login' ? 'Welcome back!' : 'Create account'}
            </h1>
            <p className="text-gray-400">
              {currentState === 'Login' 
                ? 'Sign in to access your 3D assets' 
                : 'Join our community of 3D creators'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Name field for Sign Up */}
            {currentState === 'Sign Up' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className="w-full px-4 py-3 bg-[#2a2d35] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3dd68c] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="w-full px-4 py-3 bg-[#2a2d35] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3dd68c] focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 bg-[#2a2d35] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3dd68c] focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m0 0l3.122-3.122M12 12l6.878 6.878" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            {currentState === 'Login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[#3dd68c] hover:text-[#2bc77a] text-sm transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3dd68c] text-black py-3 px-4 rounded-lg font-bold text-lg hover:bg-[#2bc77a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                currentState === 'Login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Switch between Login and Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {currentState === 'Login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
              className="mt-2 text-[#3dd68c] hover:text-[#2bc77a] font-semibold transition-colors"
            >
              {currentState === 'Login' ? 'Create Account' : 'Sign In Instead'}
            </button>
          </div>

          {/* Terms for Sign Up */}
          {currentState === 'Sign Up' && (
            <p className="mt-6 text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <button className="text-[#3dd68c] hover:underline">Terms of Service</button>
              {' '}and{' '}
              <button className="text-[#3dd68c] hover:underline">Privacy Policy</button>
            </p>
          )}
        </div>
      </div>

      {/* Right Side - 3D Character Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#3dd68c] to-[#2bc77a] items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-black rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-black rounded-lg transform rotate-45"></div>
          <div className="absolute top-1/2 left-20 w-24 h-24 border-2 border-black rounded-full"></div>
        </div>

        {/* 3D Character Illustration */}
        <div className="relative z-10 text-center">
          <div className="text-9xl mb-6 animate-bounce">🎮</div>
          <h2 className="text-4xl font-black text-black mb-4">
            {currentState === 'Login' ? 'Good to have you back!' : 'Join 50,000+ Creators'}
          </h2>
          <p className="text-xl text-black opacity-80 max-w-md">
            {currentState === 'Login' 
              ? 'Access your purchased 3D assets and continue creating amazing projects.'
              : 'Get access to thousands of high-quality 3D assets, models, and game-ready content.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;