import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link , useNavigate } from "react-router-dom";
import axios from 'axios';

const EditProfile = () => {
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
      const [userData,setUserData] = useState('')

      useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            setUserData(userData);
            setFormData({
                username: userData.username,
                password: userData.password,
                name: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                address: userData.address
            });
        }
    }, []); // Only run this effect once on component mount
    
      const navigate = useNavigate()
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]:e.target.value
        })
        if (e.target.name === 'newPassword') {
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
        e.preventDefault();
        const username = formData.username;
        const oldPassword = formData.oldPassword;
        const newPassword = formData.newPassword;
        const fullName = formData.name;
        const email = formData.email;
        const phone = formData.phone;
        const address = formData.address;
    
        // Validation checks
        if (
            username === '' ||
            oldPassword === '' ||
            newPassword === '' ||
            passwordError !== '' ||
            usernameError !== '' ||
            emailError !== '' ||
            phoneError !== '' ||
            addressError !== '' ||
            nameError !== ''
        ) {
            setError('All fields are required');
            return;
        }
    
        const body = {
            oldPassword,
            newPassword
        };
    
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        try {
            // Send a PUT request to update the password
            await axios.put(`http://localhost:5215/users/${username}/password`, body, config);
            // If password update is successful, proceed with updating other user information
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                userData.fullName = fullName;
                userData.email = email;
                userData.phone = phone;
                userData.address = address;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            navigate('/generate');
        } catch (error) {
            setError(error.response.data);
            console.log(error);
        }
    };
    
  return (
    <div className=' min-h-screen min-w-full bg-white dark:bg-slate-950 flex  flex-col items-center justify-center '>
    <div className='flex flex-col items-center justify-center w-[400px] h-[800px] mt-28  bg-slate-950 dark:bg-white rounded-xl' >
        <div className='flex items-center w-full h-[20%] justify-center'>
    <Link to='/' className='text-2xl font-bold cursor-pointer '> <span className=' text-main dark:font-medium'>Box</span><span className='text-main font-medium dark:font-bold'>Up</span> </Link>
        </div>
    <div className=' flex-1 h-[80%]  flex flex-col items-center'>
    <h1 className='font-bold text-2xl mb-5 text-white dark:text-slate-950'>Edit Profile</h1>
    <form className='flex flex-col items-center justify-center space-y-5' onSubmit={handleSubmit}>

    <input type='text' name='name' placeholder={formData.name} readOnly className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
   
    {nameError && <div className='text-red-600'>{nameError}</div>}
    <input type='username' name='username' placeholder={formData.username} readOnly className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>

    {usernameError && <div className='text-red-600'>{usernameError}</div>}

    <input type='email' name='email' placeholder={formData.email} readOnly className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {emailError && <div className='text-red-600'>{emailError}</div>}
    <input type='text' name='phone' placeholder={formData.phone}  className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {phoneError && <div className='text-red-600'>{phoneError}</div>}
    <input type='text' name='address' placeholder={formData.address} className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {addressError && <div className='text-red-600'>{addressError}</div>}

    <input type='password' name='oldPassword'  placeholder='Old Password' className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {passwordError && <div className='text-red-600'>{passwordError}</div>}

    <input type='password' name='newPassword'  placeholder='New Password' className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
    {passwordError && <div className='text-red-600'>{passwordError}</div>}

 

    <button className='bg-blue-600 text-white px-4 py-2 rounded-md'>Update Profile</button>
    {error && <div className='text-red-600'>{error}</div>} 

    </form>
    
    </div>
    </div>
</div>
  )
}

export default EditProfile