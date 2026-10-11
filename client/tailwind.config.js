/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF7E9',
          100: '#F6EDC8',
          200: '#EEDB92',
          300: '#E5C65C',
          400: '#DDB943',
          DEFAULT: '#D4AF37',
          500: '#D4AF37',
          600: '#B8932B',
          700: '#937222',
          800: '#6E551A',
          900: '#4A3911',
        },
        navy: {
          DEFAULT: '#0F172A',
          950: '#070B16',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
        display: ['Tajawal', 'Cairo', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F6EDC8 0%, #D4AF37 45%, #937222 100%)',
      },
      boxShadow: {
        gold: '0 10px 30px -10px rgba(212, 175, 55, 0.55)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        road: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-80px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        road: 'road 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};
