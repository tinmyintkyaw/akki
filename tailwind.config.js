/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontWeight: "600",
              fontSize: "1.875rem",
            },
            h2: {
              fontWeight: "600",
              marginTop: "0",
            },
            h3: {
              fontWeight: "600",
            },
            blockquote: {
              fontWeight: "400",
              fontStyle: "normal",
            },
            "blockquote p:first-of-type::before": {
              content: "",
            },
            "blockquote p:last-of-type::after": {
              content: "",
            },
            "li > *": {
              marginTop: "0",
              marginBottom: "0",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-radix")(),
    require("tailwind-scrollbar"),
  ],
};
