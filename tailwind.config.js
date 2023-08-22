/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        scrollbar: {
          thumb: "var(--scrollbar-thumb)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "var(--foreground)",
            p: {
              lineHeight: "1.75rem",
            },
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
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwindcss-radix")(),
    require("tailwind-scrollbar"),
  ],
};
