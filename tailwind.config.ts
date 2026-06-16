import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#15803d",
          dark: "#166534",
          hover: "#16a34a",
          active: "#14532d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
