import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserPlus } from 'lucide-react'
import Header from './header'
import './add_user.css'
import apis from '../utils/api'
const initialFormData = {
  username: '',
  role: 'G'
}

function AddUser() {
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)

  const roles = [
    { value: 'G', label: 'Guest' },
    { value: 'S', label: 'Salesperson' },
    { value: 'A', label: 'Admin' },
    { value: 'J', label: 'Junior' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(apis().register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }
      toast.success('User registered successfully!')
      setFormData({ username: '', role: 'G' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header should be outside the container to span full width */}
     
        <Header />

      <div className="container">
        <ToastContainer />
        <div className="icon-wrapper">
          <UserPlus />
        </div>
        <h1>Register New User</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </form>
      </div>
    </>
  )
}

export default AddUser
