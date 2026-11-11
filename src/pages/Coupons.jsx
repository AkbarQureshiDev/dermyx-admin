import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Coupons = ({ token }) => {

  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [newPercent, setNewPercent] = useState('')
  const [adding, setAdding] = useState(false)
  const [updatingCode, setUpdatingCode] = useState('')

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

  const addHandler = async (e) => {
    e.preventDefault()
    try {
      setAdding(true)
      const response = await axios.post(
        backendUrl + '/api/coupon/add',
        { code: newCode.trim(), percent: Number(newPercent) },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        setNewCode('')
        setNewPercent('')
        await fetchCoupons()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setAdding(false)
    }
  }

  const toggleHandler = async (coupon) => {
    try {
      setUpdatingCode(coupon.code)
      const response = await axios.post(
        backendUrl + '/api/coupon/status',
        { code: coupon.code, active: !coupon.active },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchCoupons()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdatingCode('')
    }
  }

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
        Deactivated codes stay listed with their history but cannot be used at checkout until they are activated again.
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

      <form onSubmit={addHandler} className='border-2 border-gray-200 rounded p-4 mb-6'>
        <p className='text-sm font-semibold text-gray-800 mb-3'>Add a discount code</p>
        <div className='flex flex-col sm:flex-row sm:items-end gap-3'>
          <div className='w-full sm:max-w-[260px]'>
            <label htmlFor='new-code' className='block text-xs uppercase tracking-wide text-gray-500 mb-1'>Code</label>
            <input
              id='new-code'
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              type='text'
              placeholder='SUMMER10'
              minLength={3}
              maxLength={24}
              pattern='[A-Za-z0-9_-]{3,24}'
              title='3-24 letters, numbers, hyphens or underscores'
              autoComplete='off'
              required
              className='w-full px-3 py-2 text-sm'
            />
          </div>

          <div className='w-full sm:w-[130px]'>
            <label htmlFor='new-percent' className='block text-xs uppercase tracking-wide text-gray-500 mb-1'>Discount %</label>
            <input
              id='new-percent'
              value={newPercent}
              onChange={(e) => setNewPercent(e.target.value)}
              type='number'
              placeholder='5'
              min={1}
              max={100}
              step={1}
              required
              className='w-full px-3 py-2 text-sm'
            />
          </div>

          <button
            type='submit'
            disabled={adding}
            className='w-full sm:w-auto bg-black text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {adding ? 'Adding…' : 'Add Code'}
          </button>
        </div>
      </form>

      <div className='border-2 border-gray-200 overflow-x-auto'>
        <div className='min-w-[640px]'>
          <div className='grid grid-cols-[1fr_0.7fr_0.8fr_0.8fr_1fr_auto] gap-3 bg-gray-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-600'>
            <p>Code</p>
            <p>Discount</p>
            <p>Orders Used</p>
            <p>Customers</p>
            <p>Discount Given</p>
            <p className='sr-only'>Actions</p>
          </div>

          {loading ? (
            <p className='px-4 py-5 text-sm text-gray-500'>Loading…</p>
          ) : coupons.length === 0 ? (
            <p className='px-4 py-5 text-sm text-gray-500'>No discount codes yet. Add one above.</p>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.code}
                className='grid grid-cols-[1fr_0.7fr_0.8fr_0.8fr_1fr_auto] gap-3 border-t border-gray-200 px-4 py-3 text-sm items-center text-gray-700'
              >
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-gray-900'>{coupon.code}</span>
                  <span
                    className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded-full ${
                      coupon.active
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-200 text-gray-600 border-gray-300'
                    }`}
                  >
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p>{coupon.percent}%</p>
                <p className='font-semibold'>{coupon.uses}</p>
                <p>{coupon.customers}</p>
                <p>{currency}{coupon.totalDiscount.toFixed(2)}</p>
                <button
                  onClick={() => toggleHandler(coupon)}
                  disabled={updatingCode === coupon.code}
                  className={`justify-self-end border text-xs px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    coupon.active
                      ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                      : 'border-green-200 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {updatingCode === coupon.code
                    ? 'Saving…'
                    : coupon.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Coupons
