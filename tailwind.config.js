const plugin = require("./");

module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: "Inter",
    },
  },
  plugins: [plugin],
};
