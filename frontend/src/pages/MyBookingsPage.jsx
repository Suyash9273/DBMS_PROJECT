// frontend/src/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/bookings/mybookings');
        setBookings(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch Bookings');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userInfo, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      //Calling cancel api 
      await axios.put(`/api/bookings/cancel/${bookingId}`);
      //updating UI
      setBookings((prevBookings) =>
        prevBookings.map((b) => {
          return (
            b.id === bookingId ? { ...b, booking_status: 'CANCELLED' } : b
          )
        })
      )
    } catch (error) {
      alert('Failed to cancel booking: ' + error.response?.data?.message);
    }
  }

  if (loading) return <div>Loading your bookings...</div>
  if (error) return <div className='text-red-500'>{error}</div>

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>My Bookings</h1>
      {
        bookings.length === 0 ? (
          <p>You have no bookings</p>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            {
              bookings.map((booking) => (
                <Card key={booking.id} className={`min-w-lg`}>
                  <CardHeader>
                    <div className='flex justify-between items-start'>

                      <div>
                        <CardTitle>PNR: {booking.pnr_number}</CardTitle>
                        <CardDescription>
                          {booking.Train.train_name} ({booking.Train.train_number})
                        </CardDescription>
                      </div>

                      <span className={
                        `inline-block px-3 py-1 rounded-full text-xs font-semibold ${booking.booking_status === 'CONFIRMED' ?
                          'bg-green-600 text-white' : booking.booking_status ===
                            'CANCELLED' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'
                        }`
                      }>
                        {booking.booking_status}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p><strong>Date:</strong> {new Date(booking.travel_date).toLocaleDateString()}</p>
                    <p><strong>Total Fare:</strong> Rs. {booking.total_fare}</p>
                    <div className='mt-2'>
                      <h4 className='font-semibold'>Passengers:</h4>
                      <ul className='list-disc list-inside'>
                        {
                          booking.Passengers.map((p) => {
                            return (
                              <li key={p.id}>
                                {p.passenger_name} ({p.age}, {p.gender}) - {p.seat_class}
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>

                    {
                      booking.booking_status !== 'CANCELLED' && (
                        <Button
                          className={`mt-4`}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )
                    }
                  </CardContent>
                </Card>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

export default MyBookingsPage;