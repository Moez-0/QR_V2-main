import React from 'react';
import { FaBars , FaTimes , FaAngleDoubleRight , FaAngleDoubleUp  } from 'react-icons/fa';
import ThemeSwitcher from './global/ThemeSwitcher';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
    const [open, setOpen] = useState(false);
    const toggleMenu = () => {
        setOpen(!open);
    }
   

  return (
    <div className={`navbar w-full h-20 bg-white dark:bg-slate-950 fixed top-0 left-0 bg-white shadow-lg z-10 `}>
        <div className='container flex justify-evenly h-full md:mx-[20%] md:w-[60%] mx-5 '>
            <div className='flex items-center w-full justify-evenly'>
            <a to='/' className='text-2xl font-bold cursor-pointer '> <span className=' text-main dark:font-medium'>BOX</span><span className='text-main font-medium dark:font-bold'>UP</span> </a>
            
        
            <ThemeSwitcher />


            </div>
        </div>
        <div className={`md:hidden ${open ? 'block' : 'hidden'} bg-slate-950 dark:bg-white h-screen w-full p-10 z-20`}>
   
            <ThemeSwitcher />

        </div>
    </div>
  );
};

export default Navbar;