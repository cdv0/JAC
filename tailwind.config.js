/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#415A77',
        lightBlueButton: '#778DA9',  // Garage only
        lightBlueText: '#3A5779',   // Garage only
        textBlack: '#1B263B',
        subheaderGray: '#9E9E9E',
        secondary: '#EEEEEE',  // Light gray for background, nav bar, other contrast
        grayBorder: '#C3C3C3',
        white: '#FFFFFF',
        textLightGray: '#9EA3AE',  // Placeholder
        stroke: '#D9D9D9',
        dangerDarkRed: '#8E080A',
        dangerBrightRed: '#C42529',
      },
    },
  },
  plugins: [],
}

