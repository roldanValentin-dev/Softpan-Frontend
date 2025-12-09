/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colores personalizados para la panadería
      colors: {
        primary: {
          50: '#fef7ed',
          100: '#fdedd3',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        secondary: {
          50: '#f8fafc',
          500: '#1f2937',
          600: '#111827',
          700: '#030712',
        }
      },
      // Espaciado optimizado para mobile
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}