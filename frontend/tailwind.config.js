/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        platform: {
          talabat: '#FF5A00',
          noon: '#FEE700',
          careem: '#00EB80',
          deliveroo: '#00CDBC',
          keeta: '#FF334B',
          smiles: '#8B5CF6',
        }
      }
    },
  },
  plugins: [],
}
