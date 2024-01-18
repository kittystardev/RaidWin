/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    translate: false,
  },

  theme: {
    colors: {
      primary: "#29334A",
      background: "#131826",
      "light-green": "#B5EC5B",
      "hover-light-green": "#CCFF78",
      "dark-purple": "#1B1439",
      "light-gray": "rgba(106, 112, 128, 0.8)",
      gray: "#D6DCEC",
      "light-blue": "#44C6E2",
      "yankees-blue": "#1C2438",
      "space-gray": "#6A7080",
      "blue-chaos": "rgba(87, 154, 255, 0.09)",
      blue: "rgba(87, 154, 255, 1)",
      nouveau: "rgba(106, 112, 127, 0.2)",
      "nouveau-main": "#6A707F",
      "space-gray-rgb": "rgba(106, 112, 128, 0.64)",
      "light-blue-rgb": "rgba(68, 198, 226, 0.08)",
      gradient: "radial-gradient(93.14% 50% at 50% 100%, #29334A 0%, rgba(19, 24, 38, 0) 100%)",
      "image-gradient-top": "#336CFF",
      "image-gradient-bottom": "#2DCBEE",
      "lighter-blue": "#579AFF",
      "chat-header-rgba": "rgba(36, 47, 74, 0.4)",
      "chat-body-rgb": "rgb(28, 36, 56)",
      "chat-tag": "#5A88FF",
      green: "#00ff00",
      "dark-purple": "#8B47FB",
      "light-yellow": "rgba(245, 198, 75, 0.32)",
      "pickled-bluewood": "#27314B",
      black: "#0F0F11",
      "midnight-express": "#212A40",
      red: "#FF6464",
      gold: "#EEC73D",
      white: "#FFFFFF",
      silver: "#A7ABBB",
      bronze: "#D19841",
      "red-dark": "#FF0000",
      "dark-yellow": "#CA9E2D",
      "electric-violet": "#8D33FF",
      mirage: "rgba(19, 24, 38, 0.42)",
      rhino: "#26314D",
      "chat-bg": "#1f283f",
      pastel: "#1C2438",
      "cloud-burst": "#242F4A",
    },
    minWidth: {
      "1/2": "240px",
    },
    minHeight: {
      "1/2": "224px",
    },
    maxWidth: {
      "1/2": "224px",
    },
    extend: {
      rotate: {
        17: "17deg",
      },
      hueRotate: {
        "-160.8": "-168.8deg",
        // 270: '270deg',
      },
      opacity: {
        8: "0.08",
        // '56': '0.56'
      },
      inset: {
        "3px": "3px",
      },
      screens: {
        xs: "450px",
      },
    },
    fontFamily: {
      Montserrat: ["Montserrat", "sans-serif"],
      Comforter: ["Comforter", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
};
