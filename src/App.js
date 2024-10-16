import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingPage from './components/BookingPage';
import LoginPage from './components/LoginPage.js';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
      {/* <header className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Sports Booking System</h1>
          </div>
        </div>
      </header> */}
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;