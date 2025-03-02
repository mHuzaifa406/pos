//// filepath: /C:/Users/Huzaifa/OneDrive/Desktop/Project POS/client/src/components/login.jsx
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Clock, LogIn } from 'lucide-react'
import { authactions } from '../store/auth-slice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import apis from '../utils/api'
import './login.css' // ensure you import your css

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Retrieve auth state from redux; fallback to localStorage if not set.
  const authData = useSelector((state) => state.auth) || JSON.parse(localStorage.getItem('authData') || '{}');
  const isLoggedIn = authData?.isAuth;

  const [formData, setFormData] = useState({
    username: '',
    clockInTime: new Date().toISOString().slice(0, 16)
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(apis().login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          clockInTime: new Date(formData.clockInTime).toISOString()
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      console.log(data);
      toast.success('Logged in successfully!')

      const authData = {
        isAuth: true,
        username: data?.user?.username,
        role: data?.user?.role,
        clockInTime: data?.user?.clockInTime,
      }
      localStorage.setItem('authData', JSON.stringify(authData))
      dispatch(authactions.setAuth(authData))

      // Redirect to Home Page after 1 second
      setTimeout(() => {
        navigate('/')
      }, 1000)

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <ToastContainer />
      {isLoggedIn && (
        <div className="home-button-wrapper">
          <button onClick={() => navigate('/')}>Home</button>
        </div>
      )}
      <div className="icon-wrapper">
        <Clock size={24} />
      </div>
      <h1>User Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="clockInTime">Clock In Time</label>
          <input
            id="clockInTime"
            type="datetime-local"
            required
            value={formData.clockInTime}
            onChange={(e) => setFormData(prev => ({ ...prev, clockInTime: e.target.value }))}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : (
            <span className="button-content">
              <LogIn size={18} />
              <span>Login &amp; Clock In</span>
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default Login;