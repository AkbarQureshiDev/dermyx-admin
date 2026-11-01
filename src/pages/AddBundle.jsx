import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const AddBundle = ({ token }) => {

  const [images, setImages] = useState(Array(8).fill(false))

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [features, setFeatures] = useState("")
  const [category, setCategory] = useState("Bundle")

  const resetForm = () => {
    setName('')
    setDescription('')
    setImages(Array(8).fill(false))
    setPrice('')
    setOriginalPrice('')
    setFeatures('')
    setCategory('Bundle')
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("originalPrice", originalPrice)
      formData.append("category", category)
      formData.append("subCategory", category)
      formData.append("bestseller", false)
      formData.append("sizes", JSON.stringify([]))
      formData.append("tags", "bundle")
      formData.append("features", features)

      images.forEach((img, index) => img && formData.append(`image${index + 1}`, img))

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        resetForm()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      <h2 className='text-xl font-semibold text-gray-700 mb-2'>Add Bundle Items</h2>

      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex flex-wrap gap-2'>
          {images.map((img, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img className='w-20 h-20 object-cover' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
              <input
                onChange={(e) => setImages(prev => prev.map((item, i) => i === index ? e.target.files[0] : item))}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Features <span className='text-gray-400 text-xs'>(comma separated, e.g. Dermatologically Tested, All Skin Types)</span></p>
        <input onChange={(e) => setFeatures(e.target.value)} value={features} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Dermatologically Tested, All Skin Types, Non-Comedogenic' />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
            <option value="Bundle">Bundle</option>
            <option value="Face Beauty">Face Beauty</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Skin Care">Skin Care</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sale Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='999' required />
        </div>
        <div>
          <p className='mb-2'>Original Price</p>
          <input onChange={(e) => setOriginalPrice(e.target.value)} value={originalPrice} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='1499' />
        </div>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>

    </form>
  )
}

export default AddBundle
