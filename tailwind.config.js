/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        netflix: '#e50914',
        primary: '#e50914',
        secondary: '#221f1f',
        background: '#141414',
        foreground: '#f2f2f2',
      },
    },
  },
  plugins: [],
};
