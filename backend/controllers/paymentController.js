import stripe from '../config/stripe.js';
import {Booking} from '../models/index.js';

/**
 * @desc Creating a Stripe Payment endpoint
 * @route /api/payments/order
 * @access Private
 */

export const createOrder = async (req, res) => {
    const {booking_id} = req.body;
    const userId = req.user.id;

    try {
        // 1. Find booking
        const booking = await Booking.findByPk(booking_id);
        if(!booking) {
            return res.status(404).json({message: 'Booking not found'});
        }

        //2. Check if the booking actually belongs to logged in user
        if(booking.user_id !== userId) {
            return res.status(401).json({message: 'Not authorized'});
        }

        //3. Check if booking is already confirmed or cancelled
        if(booking.booking_status !== 'PENDING') {
            return res.status(400).json({message: `Booking is already ${booking.booking_status}`})
        }

        //4. Creating payment portal/intent through stripe

        const paymentIntent = await stripe.paymentIntents.create({
            //Stripe expects amt in smallest unit (here paise)
            amount: Number(booking.total_fare)*100,
            currency: 'inr',
            metadata: {
                booking_id: booking.id,
                pnr: booking.pnr_number
            },
            description: `Booking for PNR: ${booking.pnr_number}`
        });

        //5. Send client secret back to frontend
        res.status(201).json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.log("Error in payment Controller: -> ", error);
        return res.status(500).json({message: 'Error in payment controller'})
    }
}