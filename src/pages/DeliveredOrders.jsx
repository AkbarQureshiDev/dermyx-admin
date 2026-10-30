import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { bundleTag } from '../utils/orderLabel'
import { MdCheckCircle } from 'react-icons/md'

const DeliveredOrders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchDeliveredOrders = async () => {
    if (!token) return
    try {
      const response = await axios.post(backendUrl + '/api/order/delivered-orders', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDeliveredOrders()
  }, [token])

  return (
    <div>
      <div className='flex items-center gap-2 mb-5'>
        <MdCheckCircle className='text-2xl text-green-500' />
        <h3 className='text-lg font-semibold'>Delivered Orders</h3>
        <span className='ml-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full'>{orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className='text-center text-gray-400 py-16'>No delivered orders yet.</div>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div
              key={index}
              className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-green-200 bg-green-50 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
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
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + ' ' + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ','}</p>
                  <p>{order.address.city + ', ' + order.address.state + ', ' + order.address.country + ', ' + order.address.zipcode}</p>
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
              <div>
                <span className='inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold'>
                  <MdCheckCircle /> Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DeliveredOrders
