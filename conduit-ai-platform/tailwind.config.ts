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
        mn: {
          primary: "#E8603C",
          "primary-hover": "#D14E2B",
          bg: "#FFFFFF",
          "bg-subtle": "#F7F7F8",
          border: "#E5E7EB",
          text: "#111827",
          muted: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
export default config;
