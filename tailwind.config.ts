import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: {
    files: [
      "./app/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./components/ui/**/*.{ts,tsx}",
    ],
  },
  theme: {},
  plugins: [],
};

export default config;
