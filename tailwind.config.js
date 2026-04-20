/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base:     '#0A0A0F',
        surface1: '#111118',
        surface2: '#1A1A24',
        lime:     '#C8F135',
        violet:   '#7C6AFA',
        muted:    '#6B6B7A',
        danger:   '#FF4D6D',
        warning:  '#FFB547',
        success:  '#00D68F',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
