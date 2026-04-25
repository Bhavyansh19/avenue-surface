/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        terra: {
          DEFAULT: "#C4622D",
          light: "#D4723D",
          dark: "#A84F24",
          50: "#FDF5F1",
          100: "#FAE8DC",
        },
        stone: {
          50: "#FAF7F2",
          100: "#F5F0EA",
          200: "#EDE5D8",
          300: "#D4C9BE",
          400: "#B8ADA0",
          500: "#8B7D72",
          600: "#6B6460",
          700: "#4A4440",
          800: "#2C2C2C",
          900: "#1C1C1C",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        serif: ['"Cormorant Garamond"', "serif"],
      },
    },
  },
  plugins: [],
};
