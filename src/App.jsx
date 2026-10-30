import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import AddBundle from './pages/AddBundle'
import List from './pages/List'
import Orders from './pages/Orders'
import DeliveredOrders from './pages/DeliveredOrders'
import Reviews from './pages/Reviews'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

axios.defaults.headers.common['Accept'] = 'application/json';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'Rs.'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  // A stale token leaves every page toasting "Not Authorized Login Again" while
  // the panel still renders as if signed in, so drop it and show the login form.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use((response) => {
      const message = response.data?.message || ''
      if (response.data?.success === false && /not authorized/i.test(message)) {
        setToken('')
      }
      return response
    })
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/add-bundle' element={<AddBundle token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/delivered-orders' element={<DeliveredOrders token={token} />} />
                <Route path='/reviews' element={<Reviews token={token} />} />
                <Route path='*' element={<Navigate to='/list' replace />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App