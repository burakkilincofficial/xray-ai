/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'xray-blue': '#0052CC',
        'xray-light': '#E6F3FF',
        'jira-blue': '#0052CC',
        'success-green': '#00875A',
        'warning-orange': '#FF8B00',
        'error-red': '#DE350B',
        // Turkcell Brand Colors
        'turkcell-yellow': '#FFD900',
        'turkcell-blue': '#003366',
        'turkcell-orange': '#FF6600',
        'turkcell-gray': '#666666'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
} 