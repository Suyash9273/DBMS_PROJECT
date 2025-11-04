import react from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from './ui/button';

const Header = () => {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            await axios.post('/api/users/logout');
            logout();
            navigate('/login');
        } catch (error) {
            console.log('Failed to logout', error);
        }
    }

    return (
        <header className='bg-gray-900 text-white shadow-md'>
            <div className='container mx-auto flex items-center justify-between p-4'>
                <div>
                    <Link to='/' className='text-xl font-bold h-2 hover:bg-gray-600 px-2 py-2 rounded-md'>Railway Reservation</Link>
                </div>

                <nav>
                    <ul className='flex items-center gap-4'>
                        <li>
                            <Link to="/pnr-status" className="hover:bg-gray-600 px-2 py-2 rounded-md">
                                PNR Status
                            </Link>
                        </li>
                        {
                            userInfo ? (
                                <>
                                    {userInfo.isAdmin && (
                                        <li>
                                            <Link to="/admin/trains" className="font-bold text-yellow-400 hover:text-yellow-200">
                                                Admin Panel
                                            </Link>
                                        </li>
                                    )}
                                    
                                    <li>
                                        <span className='font-medium'>Welcome, {userInfo.name}</span>
                                    </li>
                                    <li>
                                        <Link to='/mybookings' className='h-2 hover:bg-gray-600 px-2 py-2 rounded-md'>My Bookings</Link>
                                    </li>
                                    <li>
                                        <Button
                                            variant='outline'
                                            className='text-black border-white bg-orange-500 hover:bg-red-500 hover:text-gray-900'
                                            onClick={logoutHandler}
                                        >
                                            Logout
                                        </Button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to='/login' className='bg-[#FB923C] text-md px-3 py-1 rounded-2xl hover:bg-blue-700 transition duration-100'>
                                            Login</Link>
                                    </li>
                                    <li>
                                        <Link to='/register' className='bg-[#FB923C] text-md px-3 py-1 rounded-2xl hover:bg-blue-700 transition duration-100'>Sign Up</Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;