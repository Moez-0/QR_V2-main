import React from 'react'
import Main from '../Main'
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Generate = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status
  const navigate = useNavigate()
  useEffect(() => {
    // Check if user is authenticated (e.g., by checking for token in local storage)
    const token = localStorage.getItem('token');
    if (token) {
        setIsLoggedIn(true);
    } else {
      navigate('/')
    }

}
    , []);  
  return (
    <>
    <Main />
    </>
  )
}

export default Generate