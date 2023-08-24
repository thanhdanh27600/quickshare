/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/utils/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
