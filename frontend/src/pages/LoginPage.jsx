import React, { useState } from 'react'
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
//Import shadcn components
import {Button} from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

//Define the form schema
const formSchema = z.object({
  email: z.string().email({message: 'Invalid email address'}),
  password: z.string().min(1, {message: 'Password is required.'}),
})

const LoginPage = () => {

  const navigate = useNavigate();
  const {login} = useAuth();
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  //1. Define the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  //2. Define a submit handler
  const onSubmit = async (values) => {
    setError(null); //clear any previous errors
    try {
      const response = await axios.post('/api/users/login', values);//calling backend api to check login credentials

      //calling context login fn to set userData in localStorage
      login(response.data);

      //Navigate to redirect path or home
      navigate(redirectPath);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again');
    }
  }

  return (
    <div className='flex justify-center items-center py-8'>
      <Card className={`w-full max-w-[400px] px-3`}>
        <CardHeader>
          <CardTitle className={`text-3xl font-extrabold text-center`}>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className='flex justify-center items-center gap-2'>
                <FcGoogle className='text-3xl'/>
                <Button className='bg-gray-300 text-black hover:bg-blue-600 transition duration-200 rounded-2xl'> 
                  Continue with google
                  </Button>
              </div>


            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            New customer?{' '}
            <Link to="/register" className="underline font-bold hover:text-amber-500">
              Sign up
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage

