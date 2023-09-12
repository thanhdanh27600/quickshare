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
        'btn-hover': '0 5px 5px 0 rgba(0,0,0,0.25);',
      },
      fontFamily: {
        facebook: 'Helvetica,Arial,sans-serif',
        twitter: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica Neue,sans-serif',
        discord: '"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif',
      },
    },
  },
};
