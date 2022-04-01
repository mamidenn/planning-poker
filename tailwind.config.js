const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "card-back": "url('/card-back.svg')",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
      });
    }),
    require("@tailwindcss/aspect-ratio"),
  ],
};
