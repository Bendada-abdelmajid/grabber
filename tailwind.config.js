/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        "700":"Manrope_700Bold",
        "600":"Manrope_600SemiBold",
        "500":"Manrope_500Medium",
        "400":"Manrope_400Regular",
        "300":"Manrope_300Light"
      },
      colors:{
        primary:"#4aa556",
        // primary:"#2A4BA0",
        scondary:"#D7FFD4",
        neutral:"#F6F6F6",
        meuted:"#A1A1AB"
      }
    },
  },
  plugins: [],
}