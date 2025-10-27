import express from 'express';
import { checkAvailability, createBooking } from '../controllers/bookingController.js';
import {protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

//Public route to check availability
router.get('/availability', checkAvailability);

//Private route to create a new (pending) booking
router.post('/', protect, createBooking);

export default router;