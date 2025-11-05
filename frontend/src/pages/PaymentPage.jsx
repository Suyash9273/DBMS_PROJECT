import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

//1. Load Stripe
const stripePromise = loadStripe('pk_test_51SQ2hILzuTw0ptXuWAI20y7quS0VEhdOTRMt7TnV8bl1Mw177blGyQtOAdoXjJI99vyh0hFLCX4tkZaBxGNi659y00b1xyHoS8');

//2. Create Form
const CheckoutForm = ({ bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        //3. Confirm the payment
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `http://localhost:5173/payment-status?booking_id=${bookingId}`
            }
        });

        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message);
        } else {
            setMessage('An unexpected error occured.');
        }

        setIsLoading(false);
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button disabled={isLoading || !stripe || !elements} className="w-full mt-4">
                <span id="button-text">
                    {isLoading ? 'Processing...' : 'Pay now'}
                </span>
            </Button>
            {message && <div id="payment-message" className="text-red-500 mt-2 text-center">{message}</div>}
        </form>
    );
}

const PaymentPage = () => {
    const { bookingId } = useParams();
    const [clientSecret, setClientSecret] = useState('');

    //Fetch clientSecret from backend
    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await axios.post('/api/payments/order', {
                    booking_id: bookingId,
                });
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.log('Failed to get client secret', error);
            }
        }

        fetchClientSecret();
    }, [bookingId]);

    if (!clientSecret) {
        return <div className="text-center">Loading payment...</div>;
    }

    const options = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };

    return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
        </CardHeader>
        <CardContent>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm bookingId={bookingId} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentPage;

