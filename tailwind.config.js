/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MA Monogram Brand - Warm Luxury
        primary: {
          DEFAULT: '#C9A84C', // Gilded Gold
          light: '#D9C48A',   // Champagne
          dark: '#A8894A',    // Antique Gold
        },
        slate: {
          50: '#F2EFE8',  // Ash White (Input/Light Surface)
          100: '#EDE9DF', // Ivory Stroke (Divider)
          200: '#D6D1C4', // Linen (Card BG)
          300: '#B5A89A', // Taupe (Border)
          400: '#9C7E74', // Mocha Light (Placeholder)
          500: '#6B5147', // Mocha Mid (Secondary Text)
          600: '#553F36', // Mocha Interpolated
          700: '#4B3630', // Mocha Interpolated
          800: '#3D2E2A', // Mocha Deep (Primary Text/Dark Card)
          900: '#2A1E1B', // Mocha Darker (Dark Surface)
        },
        "background-light": "#E8E4D9", // Parchment
        "background-dark": "#2A1E1B",  // Deepest Mocha Base
      },
      fontFamily: {
        sans: ["Jost", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.10)',
        'modal': '0 24px 60px rgba(0,0,0,0.20)',
        'primary': '0 4px 16px rgba(201,168,76,0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('@tailwindcss/forms'),
    // eslint-disable-next-line no-undef
    require('@tailwindcss/container-queries')
  ],
}
