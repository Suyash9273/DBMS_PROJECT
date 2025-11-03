import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAuth } from '@/context/AuthContext'; // to check for login

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

//1. Define Schemas: ->
const passengerSchema = z.object({
    passenger_name: z.string().min(2, 'Name is required'),
    age: z.coerce.number().min(1, 'Age must be atleast 1').max(120),
    gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Gender is required' }),
    seat_class: z.enum(['SLEEPER', 'AC'], { required_error: 'Class is required' }),
});

const formSchema = z.object({
    passengers: z.array(passengerSchema).min(1, 'At least one passenger is required')
})


const BookingPage = () => {
    const { trainId } = useParams(); // used for things like /:id
    const [searchParams] = useSearchParams(); // used for query parameters(that is things after ?)
    const date = searchParams.get('date');
    const navigate = useNavigate();
    const { userInfo } = useAuth(); // Get user info from context

    const [train, setTrain] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //2. Fetch Train & Avalability Data
    useEffect(() => {
        if (!userInfo) {
            navigate(`/login?redirect=/book/${trainId}?date=${date}`);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const trainRes = await axios.get(`/api/trains/${trainId}`); // data related to particular train id
                setTrain(trainRes.data);

                //Fetch availability
                const availRes = await axios.get(`/api/bookings/availability?trainId=${trainId}&date=${date}`);

                setAvailability(availRes.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [trainId, date, userInfo, navigate]);

    //3. Setup form and field array

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            passengers: [{ passenger_name: '', age: '', gender: '', seat_class: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'passengers',
    });

    // 4. Define Submit Handler
    const onSubmit = async (values) => {
    try {
      // Mock fare calculation (e.g., Rs. 1500 per AC ticket, 500 per Sleeper)
      const total_fare = values.passengers.reduce((acc, p) => {
        return acc + (p.seat_class === 'AC' ? 1500 : 500);
      }, 0);

      const bookingData = {
        train_id: parseInt(trainId),
        travel_date: date,
        passengers: values.passengers,
        total_fare: total_fare,
      };

      // Call the create booking API
      const response = await axios.post('/api/bookings', bookingData);

      // We'll redirect to a payment page here (Day 17)
      alert(`Booking Pending! PNR: ${response.data.pnr_number}. Redirecting to payment...`);
      // navigate(`/payment/${response.data.id}`);

      navigate('/mybookings'); // For now, just go to "My Bookings"

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

    if (loading) return <div>Loading...</div>
    if (error) return <div className='text-red-500'>Error: {error}</div>
    if (!train || !availability) return <div>No data available.</div>;

    //5. Render the form

    return (
        <Card>

            <CardHeader>
                <CardTitle>Book Tickets for {train.train_name} ({train.train_number})</CardTitle>
                <p>Date: {date}</p>
                <p>Seats Available: AC ({availability.availableAC}), Sleeper ({availability.availableSleeper})</p>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        {
                            fields.map((item, index) => (
                                <div key={item.id} className='p-4 border rounded-md space-y-4 relative'>

                                    <h3 className='font-semibold'>Passenger {index + 1}</h3>
                                    {/**Passenger Name */}
                                    <FormField
                                        control={form.control}
                                        name={`passengers.${index}.passenger_name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-4">
                                        {/* Age */}
                                        <FormField
                                            control={form.control}
                                            name={`passengers.${index}.age`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Age</FormLabel>
                                                    <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {/* Gender */}
                                        <FormField
                                            control={form.control}
                                            name={`passengers.${index}.gender`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Gender</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="MALE">Male</SelectItem>
                                                            <SelectItem value="FEMALE">Female</SelectItem>
                                                            <SelectItem value="OTHER">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {/**Seat Class */}
                                    <FormField
                                        control={form.control}
                                        name={`passengers.${index}.seat_class`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Class</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {availability.availableAC > 0 && <SelectItem value="AC">AC</SelectItem>}
                                                        {availability.availableSleeper > 0 && <SelectItem value="SLEEPER">Sleeper</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Remove Button */}
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => remove(index)}
                                        disabled={fields.length <= 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        }

                        {/* Add Passenger Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => append({ passenger_name: '', age: '', gender: '', seat_class: '' })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Passenger
                        </Button>

                        <Button type="submit" className="w-full text-lg">
                            Proceed to Payment
                        </Button>

                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default BookingPage
