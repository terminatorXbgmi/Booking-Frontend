import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://booking-backend-0rno.onrender.com/api/auth/login', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); // Store the token in local storage
      navigate('/'); // Redirect to the home page after successful login
      window.location.reload();
    } catch (err) {
      setError(err.response.data.message || 'Login failed');
      console.error('Error during login:', err);
    }
  };

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <h2 className="text-2xl font-bold mb-4">Login</h2>
  //     {error && <p className="text-red-500">{error}</p>}
  //     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
  //       <div className="mb-4">
  //         <label className="block text-gray-700">Username</label>
  //         <input
  //           type="text"
  //           name="username"
  //           value={formData.username}
  //           onChange={handleChange}
  //           className="border p-2 rounded w-full"
  //           required
  //         />
  //       </div>
  //       <div className="mb-4">
  //         <label className="block text-gray-700">Password</label>
  //         <input
  //           type="password"
  //           name="password"
  //           value={formData.password}
  //           onChange={handleChange}
  //           className="border p-2 rounded w-full"
  //           required
  //         />
  //       </div>
  //       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  //         Login
  //       </button>
  //     </form>
  //   </div>
  // );
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-xl transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border-2 border-indigo-300 p-3 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border-2 border-indigo-300 p-3 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-1 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default LoginPage;
