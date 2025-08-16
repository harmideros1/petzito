/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'petzito': {
          'background': '#F8F4ED',
          'mustard': '#CA8A04',
          'olive': '#84A92C',
          'teal': '#5EB5BE',
          'warm-yellow': '#E6A623',
          'dark-brown': '#4B2E13',
        }
      }
    },
  },
  plugins: [],
}

