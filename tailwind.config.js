const plugin = require("./");

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    plugin({ metrics: { ascent: 1984, descent: -494, unitsPerEm: 2048 } }),
  ],
};
