import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [editItem, setEditItem] = useState(null) // product being edited
  const [editPrice, setEditPrice] = useState('')
  const [editOriginalPrice, setEditOriginalPrice] = useState('')
  const [editInStock, setEditInStock] = useState(true)
  const [editFeatures, setEditFeatures] = useState('')

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openEdit = (item) => {
    setEditItem(item)
    setEditPrice(item.price)
    setEditOriginalPrice(item.originalPrice || '')
    setEditInStock(item.inStock !== false)
    setEditFeatures(Array.isArray(item.features) ? item.features.join(', ') : '')
  }

  const saveUpdate = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/product/update', {
        id: editItem._id,
        price: editPrice,
        originalPrice: editOriginalPrice,
        inStock: editInStock,
        features: editFeatures
      }, { headers: { token } })

      if (response.data.success) {
        toast.success('Product updated')
        setEditItem(null)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => { fetchList() }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* Table header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item, index) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
            <img className='w-12 h-12 object-cover' src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <div>
              <p className='font-medium'>{currency}{item.price}</p>
              {item.originalPrice > 0 && (
                <p className='line-through text-gray-400 text-xs'>{currency}{item.originalPrice}</p>
              )}
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${item.inStock !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
            </span>
            <div className='flex gap-2 justify-center'>
              <button
                onClick={() => openEdit(item)}
                className='text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded'
              >
                Update
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className='text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {editItem && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-xl'>
            <h3 className='text-lg font-semibold mb-4'>Update: {editItem.name}</h3>

            <div className='flex flex-col gap-3'>
              <div>
                <label className='text-sm text-gray-600 mb-1 block'>Sale Price</label>
                <input
                  type='number'
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  className='w-full border px-3 py-2 rounded text-sm'
                  placeholder='999'
                />
              </div>

              <div>
                <label className='text-sm text-gray-600 mb-1 block'>Original Price (crossed out)</label>
                <input
                  type='number'
                  value={editOriginalPrice}
                  onChange={e => setEditOriginalPrice(e.target.value)}
                  className='w-full border px-3 py-2 rounded text-sm'
                  placeholder='1499'
                />
              </div>

              <div>
                <label className='text-sm text-gray-600 mb-2 block'>Features <span className='text-gray-400'>(comma separated)</span></label>
                <input
                  type='text'
                  value={editFeatures}
                  onChange={e => setEditFeatures(e.target.value)}
                  className='w-full border px-3 py-2 rounded text-sm'
                  placeholder='Dermatologically Tested, All Skin Types'
                />
              </div>

              <div>
                <label className='text-sm text-gray-600 mb-2 block'>Stock Status</label>
                <div className='flex gap-6'>
                  <label className='flex items-center gap-2 cursor-pointer text-sm'>
                    <input
                      type='radio'
                      name='stock'
                      checked={editInStock === true}
                      onChange={() => setEditInStock(true)}
                      className='accent-green-500'
                    />
                    In Stock
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer text-sm'>
                    <input
                      type='radio'
                      name='stock'
                      checked={editInStock === false}
                      onChange={() => setEditInStock(false)}
                      className='accent-red-500'
                    />
                    Out of Stock
                  </label>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={() => setEditItem(null)}
                className='px-4 py-2 text-sm border rounded hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={saveUpdate}
                className='px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List
