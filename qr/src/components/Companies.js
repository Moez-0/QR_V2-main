import React from 'react'

const Companies = () => {
  return (
    
    <div className='shadow-inner shadow-4xl min-h-screen min-w-full bg-[#F8F8FC] dark:bg-slate-900 flex text-black dark:text-white flex-col md:flex-row'>
        <div className='left flex-1  md:ml-[20%] flex justify-center items-center md:items-start flex-col ml-5 mr-10'>
            <h1></h1>
        </div>
        <div className='right flex-1 mr-[20%] flex flex-col justify-center items-center md:items-start f ml-5 mr-10'>
            <h1 className='md:text-8xl text-xl font-bold mb-5'><span className='bg-gradient-to-r from-blue-600 via-indigo-800 to-main inline-block text-transparent bg-clip-text'>Makes it easier</span> For Companies</h1>
            <p className='text-xl'>For generating and printing Barcodes or QR codes for products</p>
        </div>


    </div>
  )
}

export default Companies