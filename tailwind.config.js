/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chikora: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          red: {
            light: '#E63946',
            DEFAULT: '#BA181B',
            dark: '#660708',
            deep: '#370617'
          },
          gold: {
            light: '#FFE066',
            DEFAULT: '#F5A623',
            dark: '#D48806',
            accent: '#FFBE0B'
          },
          dark: {
            900: '#0F090A',
            800: '#1A0F11',
            700: '#28171A',
            600: '#3D2227'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        kurdish: ['Noto Sans Arabic', 'Segoe UI', 'Tahoma', 'sans-serif']
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(245, 166, 35, 0.35)',
        'glow-red': '0 0 25px rgba(186, 24, 27, 0.4)',
      }
    },
  },
  plugins: [],
}
