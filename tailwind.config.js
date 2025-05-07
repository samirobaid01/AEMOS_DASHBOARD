/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Standard gray colors to match Tailwind defaults
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Agriculture-themed color palette
        'leaf': {
          50: '#f0f9f1',
          100: '#dcf1df',
          200: '#bae3c0',
          300: '#8fcf9a',
          400: '#5fb570',
          500: '#3c9c50',
          600: '#2d7d3e',
          700: '#266534',
          800: '#225131',
          900: '#1e4329',
          950: '#0c2614',
        },
        'soil': {
          50: '#f9f7f4',
          100: '#f0ece6',
          200: '#e2d7cc',
          300: '#d0bca7',
          400: '#b89878',
          500: '#a6815f',
          600: '#96714e',
          700: '#7d5c42',
          800: '#674c3c',
          900: '#564035',
          950: '#2e221c',
        },
        'sky': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36befc',
          500: '#0ca6eb',
          600: '#0084c7',
          700: '#0069a1',
          800: '#0b5885',
          900: '#104c6f',
          950: '#0a314d',
        },
        'wheat': {
          50: '#fcf9eb',
          100: '#f9f2ca',
          200: '#f2e498',
          300: '#ecd05a',
          400: '#e7bc2c',
          500: '#d9a31b',
          600: '#c27e14',
          700: '#9c5a14',
          800: '#824618',
          900: '#6f3a18',
          950: '#411d0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hard': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
} 