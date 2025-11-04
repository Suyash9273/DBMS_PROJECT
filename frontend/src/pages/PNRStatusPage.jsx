import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

// form schema for the pnr input
const formSchema = z.object({
    pnr: z.string().min(6, 'PNR must be 6 chars').max(6, 'PNR must be 6'),
});

const PNRStatusPage = () => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { pnr: '' }
    });

    //Handler
    const onSubmit = async (values) => {
        setLoading(true);
        setError(null);
        setBooking(null);

        try {
            const response = await axios.get(`/api/bookings/pnr/${values.pnr.toUpperCase()}`);
            setBooking(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch PNR status');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mx-auto max-w-lg'>
            <Card>
                <CardHeader>
                    <CardTitle>Check PNR Status</CardTitle>
                    <CardDescription>Enter your 6-character PNR to check your booking status.</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="pnr"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PNR Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABC123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Checking...' : 'Check Status'}
                            </Button>
                        </form>

                    </Form>

                    {error && <div className="mt-4 text-center text-red-500">{error}</div>}
                </CardContent>
            </Card>

            {/**Display booking details */}
            {
                booking && (
                    <Card className={`mt-6`}>
                        <CardHeader>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <CardTitle>PNR: {booking.pnr_number}</CardTitle>
                                    <CardDescription>
                                        {booking.Train.train_name} ({booking.Train.train_number})
                                    </CardDescription>
                                </div>

                                <Badge
                                    variant={
                                        booking.booking_status === 'CONFIRMED'
                                            ? 'default'
                                            : booking.booking_status === 'CANCELLED'
                                                ? 'destructive'
                                                : 'secondary'
                                    }
                                >
                                    {booking.booking_status}
                                </Badge>
                            </div>

                        </CardHeader>

                        <CardContent>
                            <p><strong>Booked By:</strong> {booking.User.name} ({booking.User.email})</p>
                            <p><strong>Date:</strong> {new Date(booking.travel_date).toLocaleDateString()}</p>
                            <div className="mt-2">
                                <h4 className="font-semibold">Passengers:</h4>
                                <ul className="list-disc list-inside">
                                    {booking.Passengers.map((p) => (
                                        <li key={p.id}>
                                            {p.passenger_name} ({p.age}, {p.gender}) - {p.seat_class}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}

export default PNRStatusPage;