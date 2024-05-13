import React from 'react';
import { useState } from 'react';
import { Link , useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const [formData,setFormData] = useState({
    username:'',
    password:''
  })
  const [error,setError] = useState("");

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = formData.username;
    const  password = formData.password;
    if (username === '' || password === '') {
      setError('All fields are required')
      return
    }
    const body = JSON.stringify({username,password})
    const config = {
      headers:{
        'Content-Type':'application/json'
      }
    }
    try {
      const res = await axios.post('http://localhost:5215/login',body,config)
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
        <div className='flex flex-col items-center justify-center w-[400px] h-[600px] bg-slate-950 dark:bg-white rounded-xl' >
            <div className='flex items-center w-full h-[20%] justify-center'>
        <Link to='/' className='text-2xl font-bold cursor-pointer '> <span className=' text-main dark:font-medium'>Box</span><span className='text-main font-medium dark:font-bold'>Up</span> </Link>
            </div>
        <div className=' flex-1 h-[80%]  flex flex-col items-center'>
        <h1 className='font-bold text-2xl mb-5 text-white dark:text-slate-950'>Login</h1>
        <form className='flex flex-col items-center justify-center space-y-5' onSubmit={handleSubmit}>
        <input type='username' name='username' placeholder='Username'  className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>

       
        <input type='password' name='password'  placeholder='Password' className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600' onChange={handleChange}/>
       
        <button className='bg-blue-600 text-white px-4 py-2 rounded-md'>Login</button>
        {error && <div className='text-red-600'>{error}</div>} 

        </form>
        <p className='mt-5 text-white dark:text-slate-950'>Don't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link></p>
        </div>
        </div>
    </div>
  )
}

export default Login