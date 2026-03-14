/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#8b5cf6",
        "accent-light": "#f8f7ff",
        "accent-mid": "#f0eeff",
        "accent-dark": "#1e1b2e",
        "surface": "#f9fafb",
      },
    },
  },
  plugins: [],
}
