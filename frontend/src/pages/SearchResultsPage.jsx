import React from 'react'
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SearchResultsPage = () => {

  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  return (
    <div className='bg-gray-200'>
      <h1 className='text-3xl font-bold mb-4'>
        Search Result for: {from} to {to}
      </h1>

      <h2 className='text-xl text-muted-foreground mb-6'>
        Date: {date}
      </h2>
      {/* This is a placeholder card. We will map over API results later. */}
      <Card className="mx-auto my-auto">
        <CardHeader>
          <CardTitle>Rajdhani Express (12001)</CardTitle>
          <CardDescription>Departs: 17:00 | Arrives: 08:00</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-between">
            <div>
              <p className="font-bold">Sleeper</p>
              <p>120 available</p>
            </div>
            <div>
              <p className="font-bold">AC</p>
              <p>50 available</p>
            </div>
            <div>
              <p className="font-bold">Fare</p>
              <p>Rs. 2500</p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Book Now</Button>
        </CardFooter>

      </Card>
    </div>
  )
}

export default SearchResultsPage
