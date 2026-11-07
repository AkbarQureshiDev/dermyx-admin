import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { bundleTag } from '../utils/orderLabel'

const RANGES = [
  { key: '7', label: 'Last 7 days', days: 7 },
  { key: '15', label: 'Last 15 days', days: 15 },
  { key: '30', label: 'Last 30 days', days: 30 },
  { key: '90', label: 'Last 3 months', days: 90 },
  { key: 'all', label: 'All time', days: null },
]

const STATUSES = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']

const StatCard = ({ label, value }) => (
  <div className='border-2 border-gray-200 rounded p-4'>
    <p className='text-[11px] uppercase tracking-wide text-gray-500'>{label}</p>
    <p className='text-2xl font-bold text-gray-800 mt-1'>{value}</p>
  </div>
)

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [rangeKey, setRangeKey] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchAllOrders = async () => {
    if (!token) return null
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders([...response.data.orders].sort((a, b) => b.date - a.date))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: newStatus }, { headers: { token } })
      if (response.data.success) {
        // Keep the order in state so period stats still count it; it simply
        // drops out of the active list below once it is Delivered.
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        toast.success(newStatus === 'Delivered' ? 'Order marked as delivered' : 'Status updated')
      } else {
        toast.error(response.data.message)
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

  const scopedOrders = useMemo(() => {
    const range = RANGES.find(r => r.key === rangeKey)
    if (!range.days) return orders
    const cutoff = Date.now() - range.days * 24 * 60 * 60 * 1000
    return orders.filter(order => order.date >= cutoff)
  }, [orders, rangeKey])

  const activeOrders = scopedOrders.filter(order => order.status !== 'Delivered')

  const deliveredCount = scopedOrders.length - activeOrders.length
  const totalValue = scopedOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0)
  const statusCounts = STATUSES.reduce((acc, status) => {
    acc[status] = scopedOrders.filter(order => order.status === status).length
    return acc
  }, {})

  return (
    <div>
      {/* Header bar */}
      <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
        <h3 className='text-lg font-semibold'>Order Page</h3>
        <button
          onClick={fetchAllOrders}
          className='border border-gray-300 px-4 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors'
        >
          Refresh
        </button>
      </div>

      {/* Period filter */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {RANGES.map((range) => (
          <button
            key={range.key}
            onClick={() => setRangeKey(range.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              rangeKey === range.key
                ? 'bg-black text-white border-black'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3'>
        <StatCard label='Orders Received' value={scopedOrders.length} />
        <StatCard label='In Progress' value={activeOrders.length} />
        <StatCard label='Delivered' value={deliveredCount} />
        <StatCard label='Order Value' value={`${currency}${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
      </div>

      <div className='flex flex-wrap gap-2 mb-2 text-[11px] font-semibold text-gray-600'>
        {STATUSES.map((status) => (
          <span key={status} className='bg-gray-100 border border-gray-200 rounded-full px-3 py-1'>
            {status}: {statusCounts[status]}
          </span>
        ))}
      </div>

      <p className='text-xs text-gray-500 mb-6'>
        Counts include delivered orders. Delivered ones are listed on the Delivered Orders page.
      </p>

      {/* Orders list */}
      <div>
        {loading ? (
          <p className='text-sm text-gray-500'>Loading…</p>
        ) : activeOrders.length === 0 ? (
          <div className='text-center text-gray-400 py-16'>
            {scopedOrders.length === 0
              ? 'No orders in this period.'
              : `No active orders — all ${scopedOrders.length} orders in this period are delivered.`}
          </div>
        ) : (
          activeOrders.map((order) => (
            <div
              key={order._id}
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
                  <p>{order.address.street}</p>
                  <p>{[order.address.city, order.address.state, order.address.country, order.address.zipcode].filter(Boolean).join(', ')}</p>
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
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
