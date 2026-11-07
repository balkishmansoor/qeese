import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#802390",
          foreground: "#ffffff",
          50: "#f7eefb",
          100: "#eedcf7",
          200: "#ddb9ef",
          300: "#c68fe2",
          400: "#a85ccf",
          500: "#802390",
          600: "#6d1d78",
          700: "#581a63",
          800: "#43164e",
          900: "#2e1239",
        },
        magenta: {
          DEFAULT: "#D13D96",
          50: "#fdf0f6",
          100: "#fbe0ec",
          200: "#f6c1d9",
          300: "#ee92bd",
          400: "#e45f9c",
          500: "#D13D96",
          600: "#a92f7a",
          700: "#85255f",
          800: "#621c46",
          900: "#40132d",
        },
        rose: {
          DEFAULT: "#ED6F96",
          50: "#fdf2f6",
          100: "#fce7ee",
          200: "#f9cfdc",
          300: "#f4a3bd",
          400: "#ed6f96",
          500: "#e04577",
          600: "#c93364",
          700: "#a52751",
          800: "#811c3d",
          900: "#5e122b",
        },
        lavender: {
          DEFAULT: "#B9AAFA",
          50: "#f4f1fe",
          100: "#e9e3fd",
          200: "#d3c8fa",
          300: "#B9AAFA",
          400: "#9d89f5",
          500: "#7f64ee",
          600: "#6449e0",
          700: "#4d36b8",
          800: "#382a8c",
          900: "#241d60",
        },
        softpink: {
          DEFAULT: "#FFDCE6",
          100: "#FFF0F5",
          200: "#FFDCE6",
          300: "#FFB8CE",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(128, 35, 144, 0.06), 0 4px 14px rgba(128, 35, 144, 0.05)",
        pop: "0 10px 30px rgba(128, 35, 144, 0.15)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
