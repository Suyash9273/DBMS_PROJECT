import stripe from '../config/stripe.js';
import {Booking, Payment} from '../models/index.js';

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

/**
 * @desc Stripe webhook event handler
 * @route POST /api/payments/webhook
 * @access Public
 */

export const handleStripeWebhook = async (req, res) => {
    // Get the signature from the request headers
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        //1. Verify the event is from stripe
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
        console.log(`WebHook Error: (in paymentController)-> ${error.message}`);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }

    //2. Handling Event
    if(event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        //Get the booking_id from the metadata we set in createOrder
        const bookingId = paymentIntent.metadata.booking_id;

        try {
            // Find the booking
            const booking = await Booking.findByPk(bookingId);
            
            if(booking) {
                //3. Update status to 'Confirmed'
                booking.booking_status = 'CONFIRMED';
                await booking.save();

                //4. Create a record in Payment records
                await Payment.create({
                    booking_id: booking.id,
                    transaction_id: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    payment_status: 'SUCCESS'
                });

                console.log(`Payment successful for Booking Id: ${bookingId}`);
            } else {
                console.error(`Webhook Error: Booking not found with ID ${bookingId}`);
            }
        } catch (error) {
            console.error(`Webhook DB Error: ${error.message}`);
        }
    }

    //Receipt of event
    res.status(200).json({received: true});
}