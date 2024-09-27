# tailwind-leading-trim

![Alt text](https://github.com/deadlocked247/tailwindcss-leading-trim/blob/main/visual.png)

## Installation

```bash
npm i --save-dev tailwind-leading-trim
```

or

```bash
yarn add -D tailwind-leading-trim
```

## Setup

To set up the plugin, follow these steps:

1. Import the plugin in `tailwind.config.js`:

```javascript
module.exports = {
  ...
  theme: {
    fontFamily: {
      "sans": "Inter",
    },
    fontMetrics: {
      "capHeight": 2048,
      "ascent": 2728,
      "descent": -680,
      "lineGap": 0,
      "unitsPerEm": 2816,
    },
  },
  ...
  plugins: [require('tailwind-leading-trim')],
}
```

2. Use the Tailwind class to trim leading on both the start and the end:

```html
<div className="text-4xl font-sans leading-trim-both">
  The quick brown fox jumps over the lazy dog
</div>
```

3. You can also trim just the start or the end:

Trim the start:

```html
<div className="text-4xl font-sans leading-trim-start">
  The quick brown fox jumps over the lazy dog
</div>
```

Trim the end:

```html
<div className="text-4xl font-sans leading-trim-end">
  The quick brown fox jumps over the lazy dog
</div>
```

---

## Credits

Created by [Burak Aslan](https://x.com/turkishtea__).

---
