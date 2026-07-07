/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'attenda-bg': '#F4F5F0',
        'attenda-dark': '#11130F',
        'attenda-surface': '#FFFFFF',
        'attenda-lime': '#B8FF3D',
        'attenda-muted': '#6B7065',
        'attenda-border': 'rgba(17, 19, 15, 0.10)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '28px',
      },
    },
  },
  plugins: [],
}