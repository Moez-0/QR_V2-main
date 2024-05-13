import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const NoPage = () => {
  return (
    <div className='mt-20 min-h-screen min-w-full bg-white dark:bg-slate-950 flex text-black dark:text-white flex-col md:flex-row '>
    <div className='left flex-1  md:ml-[20%] flex justify-center items-center md:items-start flex-col ml-5 mr-10'>
    <h1 className=' font-bold  mb-5 text-xl'><TypeAnimation
  sequence={[
    'Error', // Types 'One'
    1000, // Waits 1s
    "404", // Deletes 'One' and types 'Two'
    2000, // Waits 2s
    '.', // Types 'Three' without deleting 'Two'
    () => {
      console.log('Sequence completed');
    },
  ]}
  wrapper="span"
  cursor={true}
  repeat={Infinity} /></h1>
    <p className='mb-5 md:text-xl px-6 md:px-0'>Error 404 , The page you are looking for couldn't be reached.</p>

    </div>

</div>
  )
}

export default NoPage