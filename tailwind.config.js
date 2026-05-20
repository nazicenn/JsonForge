/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#2dd4bf',
          600: '#14b8a6',
        },
      },
    },
  },
  plugins: [],
}