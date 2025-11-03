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
                <Link to='/' className='text-xl font-bold'>Railway Reservation</Link>
                <nav>
                    <ul className='flex items-center space-x-4'>
                        {
                            userInfo ? (
                                <>
                                    <li>
                                        <span className='font-medium'>Welcome, {userInfo.name}</span>
                                    </li>
                                    <li>
                                        <Link to='/mybookings' className='hover:text-gray-300'>My Bookings</Link>
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
                                    <Link to='/login' className='hover:text-gray-300'>
                                    Login</Link>
                                </li>
                                <li>
                                    <Link to='/register' className='hover:text-gray-300'>Sign Up</Link>
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