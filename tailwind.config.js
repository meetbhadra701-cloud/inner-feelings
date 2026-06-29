/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the "if" logo: black square + bright lime circle.
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#1C1C1C',
          muted: '#4A4A4A',
        },
        lime: {
          DEFAULT: '#BFD400', // accent fill — pair with black text for AA contrast
          dark: '#9DB000', // hover
          soft: '#F2F7CC', // pale wash background
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 6px 16px rgba(0,0,0,0.06)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.97)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'scale-in': 'scale-in 180ms ease-out',
      },
    },
  },
  plugins: [],
}
