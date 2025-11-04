// frontend/src/components/Admin/ManageStations.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Schema for the station form
const formSchema = z.object({
  station_name: z.string().min(3, 'Station name is required'),
  station_code: z.string().min(3, 'Station code is required').max(6, 'Code too long'),
});

const ManageStations = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { station_name: '', station_code: '' },
  });

  const onSubmit = async (values) => {
    setError('');
    setMessage('');
    try {
      // Convert station code to uppercase before sending
      const data = { ...values, station_code: values.station_code.toUpperCase() };
      
      const response = await axios.post('/api/stations', data);
      setMessage(`Success! Added station: ${response.data.station_name}`);
      form.reset(); // Clear the form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add station');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Station</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {message && <div className="text-green-500">{message}</div>}
            {error && <div className="text-red-500">{error}</div>}
            
            <FormField
              control={form.control}
              name="station_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station Name</FormLabel>
                  <FormControl><Input placeholder="e.g., New Delhi" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="station_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station Code</FormLabel>
                  <FormControl><Input placeholder="e.g., NDLS" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Adding...' : 'Add Station'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManageStations;
