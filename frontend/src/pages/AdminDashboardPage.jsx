import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminDashboardPage = () => {
    return (
        <div className='flex'>
            <nav className='w-1/4 p-4 border-r'>
                <h2 className='text-xl font-bold mb-4'>Admin Menu</h2>
                <ul className='space-y-2'>
                    <li>
                        <Button asChild variant="link" className="p-0">
                            <Link to="/admin/trains">Manage Trains</Link>
                        </Button>
                    </li>
                    <li>
                        <Button asChild variant="link" className="p-0">
                            <Link to="/admin/stations">Manage Stations</Link>
                        </Button>
                    </li>
                    <li>
                        <Button asChild variant="link" className="p-0">
                            <Link to="/admin/routes">Manage Routes</Link>
                        </Button>
                    </li>
                </ul>
            </nav>

            <div className='w-3/4 p-6'>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboardPage;