import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PaymentStatusPage = () => {
    //We will add logic here to verify payment 

    return (
        <div className="mx-auto max-w-lg text-center">
            <Card className={``}>
                <CardHeader>
                    <CardTitle>This is Payment gateway</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Your booking has been confirmed. You can view your ticket in "My Bookings".
                    </p>
                    <Button asChild>
                        <Link to="/mybookings">Go to My Bookings</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentStatusPage;