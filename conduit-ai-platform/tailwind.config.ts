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
        background: "var(--background)",
        foreground: "var(--foreground)",
        cb: {
          blue: "#0052FF",
          "blue-hover": "#0045D9",
          bg: "#050505",
          card: "#111214",
          border: "#1E1F25",
          gray: "#8A919E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
