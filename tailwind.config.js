/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#8b5cf6",
        "accent-light": "#f8f7ff",
        "accent-mid": "#f0eeff",
      },
    },
  },
  plugins: [],
}
