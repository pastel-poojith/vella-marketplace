/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f7f5',
          100: '#eeede9',
          200: '#d9d7cf',
          300: '#b8b4a7',
          400: '#8e8a7b',
          500: '#6b6759',
          600: '#4f4c41',
          700: '#36342c',
          800: '#1f1e19',
          900: '#121110',
        },
        sand: {
          50: '#faf9f6',
          100: '#f4f1ea',
          200: '#e8e2d5',
          300: '#d4cbb8',
          400: '#b5a98e',
          500: '#96876b',
          600: '#7a6d54',
          700: '#5f553f',
          800: '#433c2c',
          900: '#2a2519',
        },
        accent: {
          50: '#fdf8f3',
          100: '#fbeede',
          200: '#f5d8b9',
          300: '#edbb85',
          400: '#e2964d',
          500: '#d97a26',
          600: '#bf5f1c',
          700: '#9c471b',
          800: '#7d3a1d',
          900: '#67311c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
