/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
          primary: "#5E2892",
      },
      borderRadius: {
        custom: "12px",  
        big: "20px"
      },
       
    },
  },
  plugins: [],
}