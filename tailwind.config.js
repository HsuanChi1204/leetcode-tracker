/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-1': '#EDE9E8',
        'primary-2': '#DBD2CF',
        'primary-3': '#9DB6CF',
        'primary-4': '#B6CADE',
        'primary-5': '#D4E4ED',
      },
    },
  },
  plugins: [],
} 