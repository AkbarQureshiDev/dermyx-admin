import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { MdCheckCircle } from 'react-icons/md'

const StatCard = ({ label, value, accent }) => (
  <div className='bg-white border border-gray-200 rounded-lg px-4 py-3'>
    <p className='text-xs text-gray-500'>{label}</p>
    <p className={`text-2xl font-semibold mt-1 ${accent || 'text-gray-800'}`}>{value}</p>
  </div>
)

const Stars = ({ rating }) => (
  <span className='inline-flex gap-0.5' aria-label={`${rating} of 5`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width="14" height="14" viewBox="0 0 20 20" fill={star <= rating ? '#facc15' : '#e5e7eb'}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </span>
)

const Reviews = ({ token }) => {

  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ total: 0, average: 0, fiveStar: 0, verified: 0 })
  const [products, setProducts] = useState([])
  const [productFilter, setProductFilter] = useState('')
  const [minRating, setMinRating] = useState('')

  const fetchReviews = async () => {
    try {
      const body = {}
      if (productFilter) body.productId = productFilter
      if (minRating) body.minRating = minRating

      const response = await axios.post(backendUrl + '/api/review/all', body, { headers: { token } })
      if (response.data.success) {
        setReviews(response.data.reviews)
        setStats(response.data.stats)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeReview = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/review/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchReviews()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product/list')
        if (response.data.success) setProducts(response.data.products)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => { fetchReviews() }, [productFilter, minRating])

  return (
    <>
      <p className='mb-2'>Customer Reviews</p>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
        <StatCard label='Total reviews' value={stats.total} />
        <StatCard label='Average rating' value={stats.average} accent='text-yellow-600' />
        <StatCard label='5-star reviews' value={stats.fiveStar} accent='text-green-600' />
        <StatCard label='Verified purchases' value={stats.verified} />
      </div>

      <div className='flex flex-wrap gap-3 mb-4 items-center'>
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className='text-sm border px-3 py-2 rounded bg-white'
        >
          <option value=''>All products</option>
          {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className='text-sm border px-3 py-2 rounded bg-white'
        >
          <option value=''>Any rating</option>
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars & up</option>)}
        </select>

        <p className='text-xs text-gray-500'>
          Product ratings on the storefront update automatically from these reviews.
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border bg-gray-100 text-sm font-medium'>
          <p>Product / Customer</p>
          <p>Review</p>
          <p>Rating</p>
          <p>Helpful</p>
          <p>Date</p>
          <p className='text-center'>Action</p>
        </div>

        {reviews.length === 0 && (
          <div className='border-dashed border-2 rounded-lg p-8 text-center text-sm text-gray-500'>
            <MdCheckCircle className='w-6 h-6 mx-auto mb-2 text-gray-300' />
            No reviews match this filter yet. Customers can review a product once signed in.
          </div>
        )}

        {reviews.map((review) => (
          <div
            key={review._id}
            className='grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] gap-2 items-start border rounded-lg p-3 text-sm bg-white'
          >
            <div className='flex items-start gap-2'>
              {review.productImage && (
                <img src={review.productImage} alt="" className='w-10 h-10 object-cover rounded flex-shrink-0' />
              )}
              <div className='min-w-0'>
                <p className='font-medium truncate'>{review.productName}</p>
                <p className='text-xs text-gray-500'>{review.name}</p>
                {review.verified && (
                  <span className='text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full'>
                    VERIFIED
                  </span>
                )}
              </div>
            </div>

            <p className='text-gray-600 line-clamp-3 md:line-clamp-none'>{review.comment}</p>

            <div><Stars rating={review.rating} /></div>

            <p className='text-gray-600'>{review.helpful || 0}</p>

            <p className='text-xs text-gray-500'>{new Date(review.createdAt).toLocaleDateString()}</p>

            <div className='flex md:justify-center'>
              <button
                onClick={() => removeReview(review._id)}
                className='text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Reviews
