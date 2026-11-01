import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Coupons = ({ token }) => {

  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCoupons = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/coupon/list', {}, { headers: { token } })
      if (response.data.success) {
        setCoupons(response.data.coupons)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [token])

  const totalUses = coupons.reduce((sum, coupon) => sum + coupon.uses, 0)
  const totalCustomers = coupons.reduce((sum, coupon) => sum + coupon.customers, 0)

  return (
    <div>
      <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
        <h3 className='text-lg font-semibold'>Discount Codes</h3>
        <button
          onClick={fetchCoupons}
          className='border border-gray-300 px-4 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors'
        >
          Refresh
        </button>
      </div>

      <p className='text-xs text-gray-500 mb-4'>
        Usage counts every order placed with a code. Customers counts unique email addresses (phone when no email was given).
      </p>

      <div className='grid grid-cols-2 gap-3 mb-6 max-w-md'>
        <div className='border-2 border-gray-200 rounded p-4'>
          <p className='text-xs uppercase tracking-wide text-gray-500'>Total Redemptions</p>
          <p className='text-2xl font-bold text-gray-800 mt-1'>{totalUses}</p>
        </div>
        <div className='border-2 border-gray-200 rounded p-4'>
          <p className='text-xs uppercase tracking-wide text-gray-500'>Customers Using Codes</p>
          <p className='text-2xl font-bold text-gray-800 mt-1'>{totalCustomers}</p>
        </div>
      </div>

      <div className='border-2 border-gray-200 overflow-x-auto'>
        <div className='min-w-[560px]'>
          <div className='grid grid-cols-[1fr_0.7fr_0.8fr_0.8fr_1fr] gap-3 bg-gray-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-600'>
            <p>Code</p>
            <p>Discount</p>
            <p>Orders Used</p>
            <p>Customers</p>
            <p>Discount Given</p>
          </div>

          {loading ? (
            <p className='px-4 py-5 text-sm text-gray-500'>Loading…</p>
          ) : coupons.length === 0 ? (
            <p className='px-4 py-5 text-sm text-gray-500'>No discount codes yet.</p>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.code}
                className='grid grid-cols-[1fr_0.7fr_0.8fr_0.8fr_1fr] gap-3 border-t border-gray-200 px-4 py-3 text-sm items-center text-gray-700'
              >
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-gray-900'>{coupon.code}</span>
                  {!coupon.active && (
                    <span className='text-[10px] font-bold uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full'>Inactive</span>
                  )}
                </div>
                <p>{coupon.percent}%</p>
                <p className='font-semibold'>{coupon.uses}</p>
                <p>{coupon.customers}</p>
                <p>{currency}{coupon.totalDiscount.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Coupons
