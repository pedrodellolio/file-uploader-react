/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          100: "#4E5679",
          200: "#727BA6",
          600: "#1C1E28",
          700: "#11141E",
          800: "#0F111A",
        },
      },
    },
  },
  plugins: [],
};
