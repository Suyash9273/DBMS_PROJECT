import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
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

  //1. setting up state:->
  const [trains, setTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //2. Fetch the data when the component loads :-> 
  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setIsLoading(true);
        setError(null); 

        const response = await axios.get(
          `/api/trains/search?from=${from}&to=${to}`
        );
        
        setTrains(response.data); 
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrains();
  }, [from, to]);

  //3. Setting Loading state
  if(isLoading) {
    return <div className='text-center'>Searching for trains...</div>
  }

  //4. Render error state
  if(error) {
    return <div className='text-center text-red-500'>{error}</div>
  }

  //5. Render results: ->

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>
        Search results for: {from} to {to}
      </h1>

      <h2 className='text-xl text-muted-foreground mb-6'></h2>

      {
        trains.length == 0 ? (
          <p className='text-center'>Cannot find trains for this route...</p>
        ) : (
          trains.map((train) => {
            return (<Card key={train.id}className={`mb-4`}>
              <CardHeader>
                <CardTitle>
                  {train.train_name} ({train.train_number})
                </CardTitle>

                <CardDescription>
                 {/* Finding 'from' and 'to' stations in this train's route  */}
                Departs: {train.Routes.find(r => r.Station.station_code === from)?.departure_time}
                Arrives: {train.Routes.find(r => r.Station.station_code === to)?.arrival_time}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className='flex justify-between'>
                  <div>
                    <p className='font-bold'>Sleeper</p>
                    <p>{train.total_seats_sleeper} seats</p>
                  </div>

                  <div>
                    <p className='font-bold'>AC</p>
                    <p>{train.total_seats_ac} seats</p>
                  </div>

                  <div>
                    <p className='font-bold'>Fare</p>
                    <p>Rs. 2500</p> {/* We will make this dynamic later */}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button className={`w-full`}>Book Now</Button>
              </CardFooter>

            </Card>);
          })
        )
      }
    </div>
  )
}

export default SearchResultsPage
