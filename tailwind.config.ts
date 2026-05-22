import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#f5f5f7",
          text: "#1d1d1f",
          secondary: "#86868b",
          accent: "#0071e3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
