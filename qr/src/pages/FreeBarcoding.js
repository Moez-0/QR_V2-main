import React from 'react'
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import Home from './Home';

const FreeBarcoding = () => {
  return (
    <div className='mt-20 min-h-screen min-w-full bg-white dark:bg-slate-950 flex text-black dark:text-white flex-col justify-center items-center '>
        <div className='mt-10 flex flex-col items-center'>
    <h1 className='text-2xl font-bold mb-5'>
    <TypeAnimation
      sequence={[
        'No', // Types 'One'
        1000, // Waits 1s
        "Limit", // Deletes 'One' and types 'Two'
        2000, // Waits 2s
        'Barcoding.', // Types 'Three' without deleting 'Two'
        () => {
          console.log('Sequence completed');
        },
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity} />
</h1>
    <p className='text-center px-6'>Print the barcode now! No separate software installation is required.
Our system supports all types of label sheets and printers.</p>

    <Link to='/signup' className='bg-blue-600 text-white px-4 py-2 rounded-md mt-5'>Get Started</Link>
    </div>
    <div className='video mt-10' >
    <video  autoFocus autoPlay muted loop>

    <source src="vid.mp4"  type="video/mp4" />
    Sorry, your browser doesn't support videos.
</video>
    </div>

    <Home />
</div>
  )
}

export default FreeBarcoding