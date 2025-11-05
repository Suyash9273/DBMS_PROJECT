import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Schema for the train form
const formSchema = z.object({
  train_name: z.string().min(3, 'Train name is required'),
  train_number: z.string().min(4, 'Train number is required'),
  total_seats_sleeper: z.coerce.number().min(0, 'Must be 0 or more'),
  total_seats_ac: z.coerce.number().min(0, 'Must be 0 or more'),
  fare_sleeper: z.coerce.number().min(0, 'Fare is required'), 
  fare_ac: z.coerce.number().min(0, 'Fare is required'),
});

const ManageTrains = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      train_name: '',
      train_number: '',
      total_seats_sleeper: 0,
      total_seats_ac: 0,
      fare_sleeper: 0, 
      fare_ac: 0,
    },
  });

  const onSubmit = async (values) => {
    setError('');
    setMessage('');
    try {
      const response = await axios.post('/api/trains', values);
      setMessage(`Success! Added train: ${response.data.train_name}`);
      form.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add train');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Train</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {message && <div className="text-green-500">{message}</div>}
            {error && <div className="text-red-500">{error}</div>}
            
            <FormField
              control={form.control}
              name="train_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Mumbai Rajdhani" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="train_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train Number</FormLabel>
                  <FormControl><Input placeholder="e.g., 12951" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_seats_sleeper"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Sleeper Seats</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_seats_ac"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total AC Seats</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fare_sleeper"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleeper Fare (Rs.)</FormLabel>
                  <FormControl><Input type="number" placeholder="500" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fare_ac"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AC Fare (Rs.)</FormLabel>
                  <FormControl><Input type="number" placeholder="1500" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Adding...' : 'Add Train'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManageTrains;
