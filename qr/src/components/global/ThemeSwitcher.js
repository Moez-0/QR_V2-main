// src/components/ThemeSwitcher.js
import React, { useState, useEffect } from 'react';
import { FaSun , FaMoon } from "react-icons/fa";

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleDarkMode}
        className="p-3 rounded-md dark:bg-gray-200 bg-gray-800"
      >
        {darkMode ? <FaSun className='text-gray-800 '/> : <FaMoon className=' text-white'/>}
      </button>
    </div>
  );

};

export default ThemeSwitcher;