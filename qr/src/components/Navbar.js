import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeSwitcher from './global/ThemeSwitcher';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status

    const navigate = useNavigate();

    const toggleMenu = () => {
        setOpen(!open);
    }

    useEffect(() => {
        // Check if user is authenticated (e.g., by checking for token in local storage)
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });

    const handleLogout = () => {
        // Clear token from local storage
        localStorage.removeItem('token');

        localStorage.removeItem('userData');
        // Update state
        setIsLoggedIn(false);

        // Redirect to login page
        navigate('/');
    }

    return (
        <div className={`navbar w-full h-20 bg-white dark:bg-slate-950 fixed top-0 left-0 bg-white shadow-lg z-10 `}>
            <div className='container flex justify-start  h-full md:mx-[5%] w-full mx-8   '>
                <div className='flex items-center flex-1'>
                    <Link to='/' className='text-2xl font-bold cursor-pointer '> <span className=' text-main dark:font-medium'>BOX</span><span className='text-main font-medium dark:font-bold'>UP</span> </Link>
                    <h1 className='ml-2 text-xs'>|</h1>
                    <h1 className='ml-2 text-xs dark:text-white'>Barcode Printing</h1>
                </div>
                <div className='flex items-center flex-2'>
                    <ThemeSwitcher />
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className='ml-2 mr-5 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none'>Logout</button>
                    ) : null}
                    {!isLoggedIn ? (
                        <Link to='/login' className='px-4 py-2 mx-5 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none'>Login</Link>
                    ) : null}

                    {!isLoggedIn ? (
                        <Link to='/signup' className='px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none'>Signup</Link>
                    ) : null }

                
                    {isLoggedIn ? (
                        <Link to='/edit-profile' className='px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none'>Edit Profile</Link>
                    ) : null}
                </div>
                <div className='md:hidden'>
                    {open ? <FaTimes onClick={toggleMenu} className='text-xl text-main dark:text-gray-300' /> : <FaBars onClick={toggleMenu} className='text-xl text-main dark:text-gray-300' />}
                </div>
            </div>
            <div className={`md:hidden ${open ? 'block' : 'hidden'} bg-slate-950 dark:bg-white h-screen w-full p-10 z-20`}>
                <ThemeSwitcher />
            </div>
        </div>
    );
};

export default Navbar;
