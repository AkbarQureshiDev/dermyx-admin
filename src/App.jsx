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
import Coupons from './pages/Coupons'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

axios.defaults.headers.common['Accept'] = 'application/json';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'Rs.'

// Admin tokens expire after 12h. Reading `exp` up front means a dead token never
// renders the panel as if it were signed in.
const tokenIsExpired = (token) => {
  try {
    const payload = token.split('.')[1]
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4)
    const { exp } = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')))
    return !exp || exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

let expireSession = () => {
  localStorage.removeItem('token')
  window.location.reload()
}

// Pages fetch in their own effects, which run before App's effects, so this has
// to be registered at import time to catch the very first response.
axios.interceptors.response.use((response) => {
  const message = response.data?.message || ''
  if (response.data?.success === false && /not authorized/i.test(message)) {
    expireSession()
  }
  return response
})

const App = () => {

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token') || ''
    return stored && !tokenIsExpired(stored) ? stored : ''
  })

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  // A rejected token drops the session and shows the login form; the fallback
  // covers the moment before this effect has run.
  useEffect(() => {
    expireSession = () => setToken('')
    return () => {
      expireSession = () => {
        localStorage.removeItem('token')
        window.location.reload()
      }
    }
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
                <Route path='/coupons' element={<Coupons token={token} />} />
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