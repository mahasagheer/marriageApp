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
      backgroundColor: {
        'marriageGradient': 'linear-gradient(#FFDEDE, #FF0B55, #CF0F47)',
      },
    },
  },
  plugins: [],
}