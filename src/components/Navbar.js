import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMobile(!isMobile);
  };

  // Check if the user is logged in by checking for a token in local storage
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="bg-white shadow-lg">
  <div className="container mx-auto flex justify-between items-center p-4">
    <div className="text-blue-600 text-2xl font-bold">Sports Booking</div>
    <div className="hidden md:flex space-x-4">
      {isLoggedIn ? (
        <button className="text-blue-600 hover:underline" onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </>
      )}
    </div>
    <div className="md:hidden flex items-center">
      <button onClick={toggleMenu} className="text-blue-600 focus:outline-none">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </div>
  <div className={`md:hidden ${isMobile ? 'block' : 'hidden'} bg-white shadow-lg`}>
    <Link to="/" className="block text-blue-600 hover:underline p-2">Home</Link>
    {isLoggedIn ? (
      <button className="block text-blue-600 hover:underline p-2" onClick={() => {
        localStorage.removeItem('token');
        window.location.reload();
      }}>
        Logout
      </button>
    ) : (
      <>
        <Link to="/login" className="block text-blue-600 hover:underline p-2">Login</Link>
        <Link to="/register" className="block text-blue-600 hover:underline p-2">Register</Link>
      </>
    )}
  </div>
</nav>
  )
}

export default Navbar;