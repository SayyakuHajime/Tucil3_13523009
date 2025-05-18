/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        baloo: ["var(--font-baloo)"],
        poppins: ["var(--font-poppins)"],
      },
      colors: {
        // Rush Hour themed colors
        primary: "#A6352B", // Red color for the primary car
        "primary-hover": "#8A2D25",
        secondary: "#FFE1A8", // Beige/tan color for the board
        "secondary-hover": "#F5D79B",
        background: "#2A0026", // Deep purple background
        foreground: "#FFFFFF", // White text
      },
    },
  },
  plugins: [],
};