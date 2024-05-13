import React from 'react'
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
    <div className='mt-20 min-h-screen min-w-full bg-white dark:bg-slate-950 flex text-black dark:text-white flex-col md:flex-row '>
        <div className='left flex-1  md:ml-[20%] flex justify-center items-center md:items-start flex-col ml-5 mr-10'>
        <h1 className=' font-bold  mb-5 text-xl'><TypeAnimation
      sequence={[
        'Inventory', // Types 'One'
        1000, // Waits 1s
        'Management', // Deletes 'One' and types 'Two'
        2000, // Waits 2s
        'Reinvented', // Types 'Three' without deleting 'Two'
        () => {
          console.log('Sequence completed');
        },
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity} /></h1>
        <p className='mb-5 md:text-xl px-6 md:px-0'>BOXUP is a powerful inventory management software that helps you manage your inventory more efficiently and accurately.</p>
        <Link to="/signup" className='bg-blue-600 text-white px-4 py-2 rounded-md mt-5 md:text-xl'>Get Started</Link>
        </div>
        <div className='right flex-1 mr-[20%] flex justify-center items-center ml-5 mr-10'>
            <img src='art.svg' alt='hero' className=' size-96'/>
        </div>
    </div>
  )
}

export default Hero