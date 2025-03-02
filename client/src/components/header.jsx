import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import apis from '../utils/api';
import './header.css';

const Header = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate hook

  const handleClockOut = async (e) => {
    e.preventDefault();
    try {
      // Retrieve username from localStorage (assuming authData is stored there)
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      const username = authData.username || '';
      
      // Get current time in ISO format
      const clockOutTime = new Date().toISOString();
      console.log('Clock out time:', clockOutTime);
      // Call the Clock Out API
      const response = await fetch(apis().login, {  // ✅ Ensure the correct API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, clockOutTime })
      });
      console.log('Response:', response);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Clock out failed');
      }
      
      // ✅ Show success message
      toast.success(`Successfully Logout`);
      
      // ✅ Clear authentication data
      localStorage.removeItem('authData');

      // ✅ Redirect to Login Page after 1 second
      setTimeout(() => {

        navigate('/login');
      }, 1000);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Clock out failed');
    }
  };

  return (
    <header className="main-header">
      <nav className="nav-container">
        <div className="logo">
          Dashboard
        </div>
        <ul className="nav-list">
          <li className="nav-item">
            <a href='' className="nav-link" onClick={handleClockOut}>
              Clock out
            </a>
          </li>
          <li className="nav-item">
            <a href="/pos" className="nav-link">
              POS
            </a>
          </li>
          <li className="nav-item">
            <a href="/new-order" className="nav-link">
              New Design
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
