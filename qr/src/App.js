import React from 'react';
import { useEffect , useState } from 'react';

import Main from './Main';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import NoPage from './pages/NoPage';
import Generate from './pages/Generate';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';  
import EditProfile from './pages/EditProfile';
import FreeBarcoding from './pages/FreeBarcoding';


function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FreeBarcoding />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='generate' element={<Generate />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App;

