import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Collection from './pages/Collection'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Wishlist from './pages/Wishlist'
import OurPolicy from './components/OurPolicy'
import ForgotPassword from './pages/Frontend'
import WriteReview from './pages/WriteReview'
import MyReviews from './pages/MyReviews'

const App = () => {
  return (
    <>
      {/* ToastContainer should be outside main layout to catch global toasts */}
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="min-h-screen flex flex-col bg-[#1a1d24] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/categories' element={<Collection />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path="/privacy" element={<OurPolicy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/write-review' element={<WriteReview />} />
          <Route path='/my-reviews' element={<MyReviews />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
