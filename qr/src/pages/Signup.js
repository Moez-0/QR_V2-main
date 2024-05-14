
import React from 'react';
import { useState,useEffect } from 'react';
import { Link  , useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {

const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status
 
  const navigate = useNavigate()
  useEffect(() => {
    // Check if user is authenticated (e.g., by checking for token in local storage)
    const token = localStorage.getItem('token');
    if (token) {
	navigate('/')
        setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

}
    , []); 

  const [formData,setFormData] = useState({
    username:'',
    password:''
  })
  const [error,setError] = useState("");
  const [passwordError,setPasswordError] = useState('')
  const [usernameError,setUsernameError] = useState('')
  const [emailError,setEmailError] = useState('')
  const [phoneError,setPhoneError] = useState('')
  const [addressError,setAddressError] = useState('')
  const [nameError,setNameError] = useState('')


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
    if (e.target.name === 'password') {
      validatePassword(e.target.value)
    }
    if (e.target.name === 'username') {
      validateUsername(e.target.value)
    }
    if (e.target.name === 'email') {
      validateEmail(e.target.value)
    }
    if (e.target.name === 'phone') {
      validatePhone(e.target.value)
    }
    if (e.target.name === 'address') {
      validateAddress(e.target.value)
    }
    if (e.target.name === 'name') {
      validateName(e.target.value)
    }



  }
  const validateName = (name) => {
 
    const namePattern = /^[a-zA-Z\s]{3,}$/;
    if (!namePattern.test(name)) {
      setNameError('Invalid name')
      return
    }
    setNameError('')
  }

  const validateUsername = (username) => {
    const hasEightCharacters = /.{8,}/;
    if (!hasEightCharacters.test(username)) {
      setUsernameError('Username must be at least 8 characters long')
      return
    }
    setUsernameError('')
  }


  const validatePassword = (password) => {

    const hasNumber = /\d/;
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const hasEightCharacters = /.{8,}/;
    //start with hasEightCharacters
    if (!hasEightCharacters.test(password)) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }
    //then check for hasNumber
    if (!hasNumber.test(password)) {
      setPasswordError('Must contain at least one number')
      return
    }
    //then check for hasSpecialCharacter
    if (!hasSpecialCharacter.test(password)) {
      setPasswordError('Must contain at least one special character')
      return
    }
    setPasswordError('')
  }

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid email address')
      return
    }

    setEmailError('')
  }

  const validatePhone = (phone) => {

    const phonePattern = /^(\+216|00216)?[2-9][0-9]{7}$/;

    if (!phonePattern.test(phone)) {
      setPhoneError('Invalid phone number')
      return
    }

    setPhoneError('')
  }

  const validateAddress = (address) => {
    const addressPattern = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    if (!addressPattern.test(address)) {
      setAddressError('Invalid address')
      return
    }

    setAddressError('')

  }



  const handleSubmit = async (e) => {

    e.preventDefault()
    const username = formData.username;
    const  password = formData.password;
    const FullName = formData.name;
    const email = formData.email;
    const phone = formData.phone;

    const address = formData.address;
    if (username === '' || password === '' || passwordError !== '' || usernameError !== '' || emailError !== '' || phoneError !== '' || addressError !== '' || nameError !== '') {
      setError('All fields are required')
      return
    }
    const body = JSON.stringify({username,password,FullName,email,phone,address})
    const config = {
      headers:{
        'Content-Type':'application/json'
      }
    }
    try {
      const res = await axios.post('http://localhost:5215/signup',body,config)
      localStorage.setItem('token',res.data.token)
      const userData = res.data.userData;
      localStorage.setItem('userData',JSON.stringify(userData))
      navigate('/generate')
    } catch (error) {
      setError(error.response.data);
      console.log(error)
    }

  }
  
 



  return (
    <div className=' min-h-screen min-w-full bg-white dark:bg-slate-950 flex  flex-col items-center justify-center '>
    <div className='flex flex-col items-center justify-center w-[400px] h-[700px] mt-28  bg-slate-950 dark:bg-white rounded-xl' >
        <div className='flex items-center w-full h-[20%] justify-center'>
    <Link to='/' className='text-2xl font-bold cursor-pointer '> <span className=' text-main dark:font-medium'>Box</span><span className='text-main font-medium dark:font-bold'>Up</span> </Link>
        </div>
    <div className=' flex-1 h-[80%]  flex flex-col items-center'>
    <h1 className='font-bold text-2xl mb-5 text-white dark:text-slate-950'>Signup</h1>
    <form className='flex flex-col items-center justify-center space-y-5' onSubmit={handleSubmit}>

    <input type='text' name='name' placeholder='First and Last Name'  className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
   
    {nameError && <div className='text-red-600'>{nameError}</div>}
    <input type='username' name='username' placeholder='Username'  className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>

    {usernameError && <div className='text-red-600'>{usernameError}</div>}

    <input type='email' name='email' placeholder='Email'  className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {emailError && <div className='text-red-600'>{emailError}</div>}
    <input type='text' name='phone' placeholder='+216 96154061'  className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {phoneError && <div className='text-red-600'>{phoneError}</div>}
    <input type='text' name='address' placeholder='Address'  className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {addressError && <div className='text-red-600'>{addressError}</div>}
    <input type='password' name='password'  placeholder='Password' className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {passwordError && <div className='text-red-600'>{passwordError}</div>}
    <button className='bg-blue-600 text-white px-4 py-2 rounded-md'>Signup</button>
    {error && <div className='text-red-600'>{error}</div>} 

    </form>
    <p className='mt-5 text-white dark:text-slate-950'>Already have an account ? <Link to='/login' className='text-blue-600'>Login</Link></p>
    </div>
    </div>
</div>
  )
}

export default Signup