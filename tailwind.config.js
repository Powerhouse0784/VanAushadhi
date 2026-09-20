/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canopy: {
          50: "#EFF8F1",
          100: "#DBEFDE",
          200: "#B4DEBC",
          300: "#8CCC99",
          400: "#5FAE70",
          500: "#3D8A4E",
          600: "#2C6E3B",
          700: "#22562F",
          800: "#194023",
          900: "#0F2A17",
          950: "#091C0F",
        },
        bark: {
          50: "#F8F5EF",
          100: "#EFE7D6",
          200: "#DFCFAE",
          300: "#C7AD7C",
          400: "#AD8A55",
          500: "#8C6C3C",
          600: "#6E5330",
          700: "#523E24",
          800: "#382A19",
          900: "#22190F",
        },
        cream: {
          50: "#FFFDF8",
          100: "#FBF6EA",
          200: "#F5ECD6",
          300: "#EEE0BC",
        },
        status: {
          alive: "#2C6E3B",
          attention: "#C99A2E",
          risk: "#C05621",
          lost: "#B3392C",
          pending: "#2E6FA6",
          replaced: "#7C4FB0",
        },
      },
      fontFamily: {
        display: ["Fraunces_600SemiBold"],
        body: ["Inter_400Regular"],
        "body-medium": ["Inter_500Medium"],
        "body-semibold": ["Inter_600SemiBold"],
        "body-bold": ["Inter_700Bold"],
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
