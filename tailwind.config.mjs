/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#FFF5F6',
          100: '#FFE8EB',
          200: '#FED5DC',
          300: '#F5E1E4',
          400: '#E8A0B4',
          500: '#D47A94',
          600: '#C05A7A',
          700: '#A34A65',
          800: '#8B3A4F',
          900: '#6E2E40',
        },
        gold: {
          50: '#FDF8ED',
          100: '#F9EECC',
          200: '#F2DD99',
          300: '#E8C566',
          400: '#DDB33D',
          500: '#D4AF37',
          600: '#B8942E',
          700: '#967A25',
          800: '#7A631E',
          900: '#5E4E17',
        },
        cream: {
          50: '#FFFCF7',
          100: '#FFF8F0',
          200: '#FFF3E6',
          300: '#FFEDD6',
          400: '#FFE0B8',
          500: '#FFD49A',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
}
