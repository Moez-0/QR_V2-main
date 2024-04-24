/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      colors : {
        'grayBg': '#E9E9ED',
        'main': '#4F67FF',
        'secondary': '#6e81ff',
        'lightGray' : '#CBCCD3'
      },
      fontFamily: {
        'Montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}