/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'display': 'display',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};
