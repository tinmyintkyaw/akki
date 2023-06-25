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
            a: {
              cursor: "pointer",
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
            "ul[data-type='taskList']": {
              listStyleType: "none",
            },
            "ul[data-type='taskList'] > li": {
              position: "relative",
            },
            "ul[data-type='taskList'] > li > label": {
              position: "absolute",
              left: "-1.25rem",
            },
            "ul[data-type='taskList'] > li > label > input": {
              width: "1rem",
              height: "1.75rem",
            },
            "ul[data-type='taskList'] > li > div > *": {
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
