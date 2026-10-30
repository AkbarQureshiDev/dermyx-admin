import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { bundleTag } from '../utils/orderLabel'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        const nonDelivered = response.data.orders.reverse().filter(o => o.status !== 'Delivered')
        setOrders(nonDelivered)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: newStatus }, { headers: { token } })
      if (response.data.success) {
        if (newStatus === 'Delivered') {
          setOrders(prev => prev.filter(o => o._id !== orderId))
          toast.success('Order marked as delivered and removed from panel')
        } else {
          await fetchAllOrders()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deleteHandler = async (orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/delete', { orderId }, { headers: { token } })
      if (response.data.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId))
        toast.success('Order deleted')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      {/* Header bar */}
      <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
        <h3 className='text-lg font-semibold'>Order Page</h3>
      </div>

      {/* Orders list */}
      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
          >
            <img className='w-12' src={assets.parcel_icon} alt="" />

            <div>
              <div>
                {order.items.map((item, idx) => (
                  <p className='py-0.5' key={idx}>
                    {item.name} x {item.quantity} <span className='text-blue-600 font-medium'>{bundleTag(item.size, item.quantity)}</span>
                    {idx !== order.items.length - 1 && ' ,'}
                  </p>
                ))}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>

            <div>
              <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>

            <div className='flex flex-col gap-2'>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className='p-2 font-semibold'
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button
                onClick={() => deleteHandler(order._id)}
                className='bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-3 rounded font-semibold transition-colors'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
