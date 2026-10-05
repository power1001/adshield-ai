import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070a12",
        surface: "#0d1322",
        "surface-card": "#11182c",
        shield: {
          emerald: "#10b981",
          amber: "#f59e0b",
          crimson: "#ef4444",
          cyan: "#06b6d4",
          blue: "#3b82f6",
        },
      },
      boxShadow: {
        "shield-emerald": "0 0 35px -5px rgba(16, 185, 129, 0.25)",
        "shield-crimson": "0 0 35px -5px rgba(239, 68, 68, 0.35)",
        "shield-amber": "0 0 35px -5px rgba(245, 158, 11, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
