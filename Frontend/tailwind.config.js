/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976d2",
          light: "#42a5f5",
          dark: "#1565c0",
        },
        secondary: "#dc004e",
        surface: "#ffffff",
        muted: "#64748b",
      },
      fontFamily: {
        sans: ['"NumbersFont"', '"Tajawal"', '"Cairo"', '"Roboto"', "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};
