/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        main: "#153243",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  corePlugins: {
    preflight: false,
  },
};
