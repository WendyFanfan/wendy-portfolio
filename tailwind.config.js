/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: { 950: '#141119', 900: '#1b1722', 800: '#251f2e', 700: '#322a3d', 600: '#463b54' },
        peach: '#f2a679',
        terracotta: '#c8664a',
        cream: '#f4ead9',
        dusty: '#d9a0a6',
        lavender: '#a99cc9',
        greyblue: '#8592ad',
        gold: '#e8c27a',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      letterSpacing: { cosmic: '0.42em' },
    },
  },
  plugins: [],
}
