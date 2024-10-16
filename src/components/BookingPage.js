import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function BookingPage() {
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState("");
  const [availableCourts, setAvailableCourts] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newBooking, setNewBooking] = useState({ court: '', startTime: '', endTime: '' });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      const decoded = jwtDecode(token);
      setUser(decoded.user); // Set user from token
    }
    fetchCenters();
  }, [navigate]);

  const fetchCenters = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/centers');
      setCenters(response.data);
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchSports = async (centerId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/sports?center=${centerId}`);
      setSports(response.data);
      setSelectedSport(''); // Reset selected sport when center changes
      setAvailableCourts([]); // Reset available courts
      setAvailableSlots([]); // Reset available slots
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/bookings?center=${selectedCenter}&sport=${selectedSport}&date=${selectedDate}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableCourts = async (sportId) => {
    if (sportId) {
      try {
        const sport = sports.find(s => s._id === sportId);
        if (sport) {
          setAvailableCourts(sport.courts); // Assuming courts are stored in the sport object
          setNewBooking({ ...newBooking, court: sport.courts[0] }); // Set default court to the first available
          fetchAvailableSlots(sport.courts[0]); // Fetch available slots for the first court
        }
      } catch (error) {
        console.error('Error fetching available courts:', error);
      }
    }
  };

  const fetchAvailableSlots = async (court) => {
    console.log({ selectedCenter, selectedSport, selectedDate })
    if (selectedCenter && selectedSport && selectedDate) {
      try {
        const response = await axios.get(`http://localhost:4000/api/bookings/available-slots`, {
          params: {
            center: selectedCenter,
            sport: selectedSport,
            court: court,
            date: selectedDate,
          },
        });
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    }
  };

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    console.log(centerId);

    fetchSports(centerId);
    setAvailableCourts([]); // Reset available courts when center changes
    setAvailableSlots([]);

    // Reset available slots
  };


  const handleSportChange = (e) => {
    const sportId = e.target.value;
    setSelectedSport(sportId);
    console.log(selectedSport);
    fetchAvailableCourts(sportId); // Fetch available courts when sport changes
    fetchAvailableSlots(newBooking.court); // Fetch available slots for the selected court
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    fetchAvailableSlots(newBooking.court); // Fetch available slots when date changes
  };

  const handleNewBookingChange = (e) => {
    const { name, value } = e.target;

    let endTime = `${value.split(':')[0]}:59`

    setNewBooking({ ...newBooking, [name]: value, endTime });
    if (name === 'court') {
      fetchAvailableSlots(value); // Fetch available slots when court changes
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/bookings', {
        center: selectedCenter,
        sport: selectedSport,
        court: newBooking.court,
        date: selectedDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
      });
      fetchBookings();
      setNewBooking({ court: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="space-y-16 px-8 py-12 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-100 to-teal-100 py-8 px-10 rounded-xl shadow-lg text-gray-800">
        <h1 className="text-5xl font-extrabold tracking-wide">Booking System</h1>
      </header>

      {/* Booking Details Section */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl transition duration-300 transform hover:-translate-y-2 hover:shadow-3xl">
        <h2 className="text-4xl font-bold text-indigo-500 mb-8">Select Booking Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select
            value={selectedCenter}
            onChange={handleCenterChange}
            className="border-2 border-indigo-200 p-4 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
          >
            <option value="">Select Center</option>
            {centers.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
          </select>
          <select
            value={selectedSport}
            onChange={handleSportChange}
            className="border-2 border-indigo-200 p-4 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
          >
            <option value="">Select Sport</option>
            {sports.map((sport) => (
              <option key={sport._id} value={sport._id}>
                {sport.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border-2 border-indigo-200 p-4 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
            min={new Date().toISOString().split("T")[0]} // Disable past dates
          />
        </div>
        <button
          onClick={fetchBookings}
          className="mt-10 w-full bg-gradient-to-r from-teal-300 to-blue-300 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:from-teal-400 hover:to-blue-400 transform hover:-translate-y-2 transition duration-300 ease-in-out"
        >
          View Bookings
        </button>
      </div>


      <div className="bg-white p-10 rounded-2xl shadow-2xl transition duration-300 transform hover:-translate-y-2 hover:shadow-3xl">
        <h2 className="text-4xl font-bold text-indigo-600 mb-8 text-center">Current Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Date with Calendar Icon */}
              <p className="text-lg text-gray-700 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 2v2M8 2v2M4 6h16M4 10h16v10H4V10z"
                  />
                </svg>
                <span className="font-semibold">Date:</span> {new Date(booking.date).toLocaleDateString('en-GB')}
              </p>

              {/* Sport */}
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">Sport:</span> {booking.sport.name}
              </p>

              {/* Center */}
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">Center:</span> {booking.center.name}
              </p>

              {/* Court */}
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">Court:</span> {booking.court}
              </p>

              {/* Time with Timer Icon */}
              <p className="text-lg text-gray-700 flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold">Time:</span> {booking.startTime} - {booking.endTime}
              </p>
            </div>
          ))}
        </div>
      </div>



      {/* Create New Booking Section */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl transition duration-300 transform hover:-translate-y-2 hover:shadow-3xl">
        <h2 className="text-4xl font-bold text-indigo-500 mb-8">Create New Booking</h2>
        <form onSubmit={handleCreateBooking} className="space-y-6">
          <select
            name="court"
            value={newBooking.court}
            onChange={handleNewBookingChange}
            className="border-2 border-indigo-200 p-4 rounded-xl w-full text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
            required
          >
            <option value="">Select Court</option>
            {availableCourts.map((court, index) => (
              <option key={index} value={court}>
                {court}
              </option>
            ))}
          </select>
          <select
            name="startTime"
            value={newBooking.startTime}
            onChange={handleNewBookingChange}
            className="border-2 border-indigo-200 p-4 rounded-xl w-full text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
            required
          >
            <option value="">Select Start Time</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot.startTime}>
                {slot.startTime}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-300 to-teal-400 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:from-green-400 hover:to-teal-500 transform hover:-translate-y-2 transition duration-300 ease-in-out"
          >
            Create Booking
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-8 mt-12">
        &copy; 2024 Booking System | All rights reserved.
      </footer>
    </div>
  );


}

export default BookingPage;