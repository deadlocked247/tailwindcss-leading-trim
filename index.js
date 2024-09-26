const plugin = require("tailwindcss/plugin");

/**
 * Converts rem or em values to pixels
 * @param {string|number} lineHeight - The line height value to convert
 * @returns {string} The converted line height in pixels
 */
function convertRemToPixels(lineHeight) {
  const rootFontSize = 16;

  if (typeof lineHeight === "string") {
    if (lineHeight.endsWith("rem")) {
      const remValue = parseFloat(lineHeight);
      const pixelValue = remValue * rootFontSize;
      return `${pixelValue}px`;
    } else if (!isNaN(parseFloat(lineHeight))) {
      const emValue = parseFloat(lineHeight);
      const pixelValue = emValue * rootFontSize;
      return `${pixelValue}px`;
    }
  } else if (typeof lineHeight === "number") {
    const pixelValue = lineHeight * rootFontSize;
    return `${pixelValue}px`;
  }

  return lineHeight.toString(); // Return the original value if it's not in rem or em
}

/**
 * @typedef {Object} Metrics
 * @property {number} ascent - The ascent value
 * @property {number} descent - The descent value
 * @property {number} unitsPerEm - The units per em value
 */

/**
 * @param {Metrics} metrics - The font metrics
 * @returns {import('tailwindcss/plugin').PluginCreator}
 */
const config = ({ metrics }) =>
  plugin(function ({ addUtilities, addBase, theme }) {
    const fontSize = theme("fontSize");
    const { ascent, descent, unitsPerEm } = metrics;

    addBase({
      ".leading-trim::before": {
        content: '""',
        display: "table",
        marginBottom: "var(--trim-space)",
      },
    });

    addBase({
      ".leading-trim::after": {
        content: '""',
        display: "table",
        marginTop: "var(--trim-space)",
      },
    });

    Object.entries(fontSize).forEach(([key, value]) => {
      const [size, props] = value;
      const fontSize = convertRemToPixels(size);
      const lineHeight = props.lineHeight.endsWith("rem")
        ? parseFloat(convertRemToPixels(props.lineHeight))
        : parseFloat(props.lineHeight) * parseFloat(fontSize);
      console.log(key);
      const val = {
        "--trim-space": `calc(((${lineHeight}px - (((${ascent} + ${descent}) / ${unitsPerEm}) * ${fontSize})) / -2));`,
      };
      addUtilities({
        [`.leading-trim.text-${key}`]: val,
      });
    });
  });

module.exports = config;
