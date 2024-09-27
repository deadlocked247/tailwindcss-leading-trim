const plugin = require("tailwindcss/plugin");
const { map, fromPairs, find, isPlainObject, get } = require("lodash");
const selectorParser = require("postcss-selector-parser");

const escapeCssClass = (className) => {
  const node = selectorParser.className();
  node.value = className;
  return get(node, "raws.value", node.value);
};

const extractNumericValue = (str) => str.match(/[\d.]+/)[0];

const createCssClass = (name) => `.${escapeCssClass(name)}`;

const generateClassName = (prefix, key) => {
  if (key === "DEFAULT") return createCssClass(prefix);
  if (key === "-") return createCssClass(`-${prefix}`);
  if (key.startsWith("-")) return createCssClass(`-${prefix}${key}`);
  return createCssClass(`${prefix}-${key}`);
};

const calculateLeadingOffset = (value) => {
  const numericValue = extractNumericValue(value);
  return numericValue === value
    ? `${-0.5 * (Number(value) - 1)}em`
    : `calc( (${value} - 1em) / -2)`;
};

const fontMetricsData = require("./metrics.json");

module.exports = plugin(
  function ({ addUtilities, e, theme, variants, addBase }) {
    // Define common styles
    const beforeStyles = {
      marginBottom:
        "calc( var(--leading-offset, -.25em) + var(--font-offset-start, 0em) )",
    };
    const afterStyles = {
      marginTop:
        "calc( var(--leading-offset, -.25em) + var(--font-offset-start, 0em) )",
    };
    const pseudoElementStyles = {
      content: '""',
      display: "table",
    };

    // Add base styles for leading trim classes
    addBase({
      ".leading-trim-both::before": {
        ...pseudoElementStyles,
        ...beforeStyles,
      },
      ".leading-trim-both::after": {
        ...pseudoElementStyles,
        ...afterStyles,
      },
      ".leading-trim-start::before": {
        ...pseudoElementStyles,
        ...beforeStyles,
      },
      ".leading-trim-end::after": {
        ...pseudoElementStyles,
        ...afterStyles,
      },
    });

    // Generate utilities for font family
    const fontFamilyUtilities = fromPairs(
      map(theme("fontFamily"), (value, key) => {
        const preferredFont = Array.isArray(value) ? value[0] : value;
        const fontFamily = Array.isArray(value) ? value.join(", ") : value;

        const fontMetrics =
          theme(`fontMetrics.${preferredFont}`) ||
          find(fontMetricsData, { familyName: preferredFont });

        if (!fontMetrics) {
          throw new Error(
            `Font metrics not found for font: ${preferredFont}\nPlease add a fontMetrics property in tailwind.config.js with the type capHeight, ascent, descent, lineGap, and unitsPerEm.`
          );
        }

        const { ascent, descent, unitsPerEm, capHeight } = fontMetrics;
        const halfLeading = (ascent - descent - unitsPerEm) / 2;
        const offsetStart =
          (ascent - capHeight - halfLeading) / -unitsPerEm + "em";
        const offsetEnd = (halfLeading + descent) / unitsPerEm + "em";
        const adjust = (unitsPerEm / capHeight).toString();

        return [
          `.${e(`font-${key}`)}`,
          {
            "font-family": fontFamily,
            "--font-offset-start": offsetStart,
            "--font-offset-end": offsetEnd,
            "--font-adjust": adjust,
          },
        ];
      })
    );

    addUtilities(fontFamilyUtilities, variants("fontFamily"));

    // Generate utilities for font size based on spacing
    const fontSizeUtilitiesFromSpacing = fromPairs(
      map(theme("spacing"), (value, key) => [
        generateClassName("text", key),
        {
          "font-size": `calc(${value} * var(--font-adjust, 1))`,
        },
      ])
    );

    addUtilities(fontSizeUtilitiesFromSpacing, variants("fontSize"));

    // Generate utilities for font size from fontSize theme
    const fontSizeUtilities = fromPairs(
      map(theme("fontSize"), (value, key) => {
        const [fontSizeValue, options] = Array.isArray(value) ? value : [value];
        const { lineHeight, letterSpacing } = isPlainObject(options)
          ? options
          : { lineHeight: options };

        const utilityStyles = {
          "font-size": fontSizeValue,
        };

        if (lineHeight !== undefined) {
          utilityStyles["line-height"] = lineHeight;
          utilityStyles["--leading-offset"] =
            calculateLeadingOffset(lineHeight);
        }
        if (letterSpacing !== undefined) {
          utilityStyles["letter-spacing"] = letterSpacing;
        }

        return [generateClassName("text", key), utilityStyles];
      })
    );

    addUtilities(fontSizeUtilities, variants("fontSize"));

    // Generate utilities for line height
    const lineHeightUtilities = fromPairs(
      map(theme("lineHeight"), (value, key) => [
        `.${e(`leading-${key}`)}`,
        {
          "line-height": value,
          "--leading-offset": calculateLeadingOffset(value),
        },
      ])
    );

    addUtilities(lineHeightUtilities, variants("lineHeight"));
  },
  {
    corePlugins: {
      fontFamily: false,
      fontSize: false,
      lineHeight: false,
    },
  }
);
