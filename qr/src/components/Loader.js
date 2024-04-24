import React, { useEffect, useState } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

const Loader = () => {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#4F67FF");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`h-full w-full fixed top-0 left-0 bg-white transition-all ease-in-out duration-300 z-50 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className='flex justify-center items-center h-full'>
                {loading ? <ClimbingBoxLoader color={color} size={50} /> : null}
            </div>
        </div>
    );
};

export default Loader;
