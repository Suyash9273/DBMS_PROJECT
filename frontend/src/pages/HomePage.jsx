import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

//1. Define the form schema 
const formSchema = z.object({
  from: z.string().min(2, { message: 'Station Code must have atleast two chars' }),
  to: z.string().min(2, { message: 'Station code must have atleast two chars' }),
  date: z.date({ required_error: 'A date is required' }),
})

const HomePage = () => {
  const navigate = useNavigate();

  //2. Define the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: '',
      to: '',
    }
  });

  // 3. Define a submit handler
  function onSubmit(values) {
    // console.log("This is how form from useForm looks like : -> ", form);
    // Format the date to YYYY-MM-DD
    const formattedDate = format(values.date, 'yyyy-MM-dd');
    //navigate to the search results page with query parameters
    navigate(`/search?from=${values.from}&to=${values.to}&date=${formattedDate}`);
  }

  return (
    <div className='mx-auto max-w-[400px] bg-[#1C1C1E] rounded-2xl p-10'>

      <h1 className='text-3xl font-bold text-center mb-6 text-[#EAEAEA] '>
        Book Your Ticket
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[#EAEAEA] font-bold text-md'>From</FormLabel>
                <FormControl>
                  <Input className={`text-white font-semibold`} placeholder="Enter a station code (e.g. NDLS)" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[#EAEAEA] text-md'>To</FormLabel>
                <FormControl>
                  <Input className={`text-white font-semibold`} placeholder="Enter station code (e.g., BCT)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='text-[#EAEAEA] text-md'>Date of Journey</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {
                          field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )
                        }

                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />

                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date > new Date('2030-01-01')}
                      initialFocus />
                  </PopoverContent>

                </Popover>
              </FormItem>
            )
          }
          />

          <Button type="submit" className="w-full text-black text-md font-bold bg-[#FB923C] Orange-Transition">
            Search Trains
          </Button>
        </form>
      </Form>
    </div>
  );

}

export default HomePage
