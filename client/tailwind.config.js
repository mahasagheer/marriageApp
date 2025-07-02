/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        marriagePink: '#FFDEDE',
        marriageHotPink: '#FF0B55',
        marriageRed: '#CF0F47',
      },
    },
  },
  plugins: [],
}