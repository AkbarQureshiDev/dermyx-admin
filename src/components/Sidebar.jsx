import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MdCheckCircle } from 'react-icons/md'

const Sidebar = () => {

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-150 ${
      isActive ? 'bg-pink-50 border-pink-400 text-pink-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'
    }`

  return (
    <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink className={linkClass} to="/add">
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink className={linkClass} to="/add-bundle">
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Add Bundle Items</p>
        </NavLink>

        <NavLink className={linkClass} to="/list">
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>List Items</p>
        </NavLink>

        <NavLink className={linkClass} to="/orders">
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Orders</p>
        </NavLink>

        <NavLink className={linkClass} to="/delivered-orders">
          <MdCheckCircle className='w-5 h-5 text-green-500' />
          <p className='hidden md:block'>Delivered Orders</p>
        </NavLink>

        <NavLink className={linkClass} to="/reviews">
          <svg className='w-5 h-5 text-yellow-500' viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <p className='hidden md:block'>Reviews</p>
        </NavLink>

        <NavLink className={linkClass} to="/coupons">
          <svg className='w-5 h-5 text-pink-500' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
            <path d='M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7c0 .53.21 1.04.59 1.41l9 9a2 2 0 002.82 0l7-7a2 2 0 000-2.83zM6.5 8A1.5 1.5 0 118 6.5 1.5 1.5 0 016.5 8z' />
          </svg>
          <p className='hidden md:block'>Discount Codes</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
