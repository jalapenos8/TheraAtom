/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e',
        secondary: '#14b8a6',
        accent: '#f97316',
        background: '#f8fafc',
        text: '#0f172a',
      },
    },
  },
  plugins: [],
} 