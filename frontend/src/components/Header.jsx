import react from 'react';

const Header = () => {
    return (
        <header className='bg-gray-900 text-white shadow-md'>
            <div className='container mx-auto flex items-center justify-between p-4'>
                {/* We use an <a> tag for now, will replace with <Link> later */}
                <a href='/' className='text-xl font-bold'>Railway Reservation</a>
                <nav>
                    <ul className='flex space-x-4'>
                        <li>
                            <a href='/login' className='bg-[#FB923C] text-md font-bold px-3 py-0.5 rounded-2xl hover:bg-blue-700 transition duration-100'>
                            Login
                            </a>
                        </li>

                        <li>
                            <a href='/register' className='bg-[#FB923C] text-md font-bold px-3 py-0.5 rounded-2xl hover:bg-blue-700 transition duration-100'>
                            Sign-Up
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;