import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Schema for the route form
const formSchema = z.object({
  train_id: z.coerce.number().min(1, 'Train ID is required'),
  station_id: z.coerce.number().min(1, 'Station ID is required'),
  stop_number: z.coerce.number().min(1, 'Stop number is required'),
  arrival_time: z.string().optional(), // Format: HH:MM:SS
  departure_time: z.string().optional(),
});

const ManageRoutes = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      train_id: '',
      station_id: '',
      stop_number: '',
      arrival_time: '',
      departure_time: '',
    },
  });

  const onSubmit = async (values) => {
    setError('');
    setMessage('');
    
    // Clean up empty time fields
    const data = {
      ...values,
      arrival_time: values.arrival_time || null,
      departure_time: values.departure_time || null,
    };

    try {
      const response = await axios.post('/api/routes', data);
      setMessage(`Success! Added route stop (ID: ${response.data.id})`);
      form.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add route');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Route Stop</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {message && <div className="text-green-500">{message}</div>}
            {error && <div className="text-red-500">{error}</div>}
            
            <FormField
              control={form.control}
              name="train_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train ID</FormLabel>
                  <FormControl><Input type="number" placeholder="1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="station_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station ID</FormLabel>
                  <FormControl><Input type="number" placeholder="1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stop_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop Number</FormLabel>
                  <FormControl><Input type="number" placeholder="1 (for source)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrival_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Time (HH:MM:SS) (Optional)</FormLabel>
                  <FormControl><Input placeholder="21:30:00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departure_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Time (HH:MM:SS) (Optional)</FormLabel>
                  <FormControl><Input placeholder="21:35:00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Adding...' : 'Add Route Stop'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManageRoutes;
