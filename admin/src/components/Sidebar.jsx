import React from 'react'
import Navbar from './Navbar'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

function Sidebar() {
    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 rounded-l ' to="/add">
                    <img className='' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Items</p>
                </NavLink>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 rounded-l ' to="/list">
                    <img className='' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 rounded-l ' to="/orders">
                    <img className='' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Orders Items</p>
                </NavLink>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 rounded-l ' to="/manage-stock">
                    <img className='' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Manage Stock</p>
                </NavLink>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 rounded-l ' to="/add-coupon">
                    <img className='' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Coupon</p>
                </NavLink>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 rounded-l ' to="/list-coupons">
                    <img className='' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Manage Coupons</p>
                </NavLink>
                <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 rounded-l ' to="/dashboard">
                    <img className='' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>

            </div>
        </div>
    )
}

export default Sidebar