import express from 'express';
import { checkAvailability, createBooking, getMyBookings, getBookingByPNR, cancelBooking } from '../controllers/bookingController.js';
import {protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- Public Routes ---
router.get('/availability', checkAvailability);
router.get('/pnr/:pnr', getBookingByPNR); // Get booking by PNR

// --- Private Routes ---
router.post('/', protect, createBooking); // Create new booking
router.get('/mybookings', protect, getMyBookings); // Get user's bookings
router.put('/cancel/:id', protect, cancelBooking); // Cancel a booking

export default router;