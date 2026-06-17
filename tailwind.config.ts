import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102027",
        sea: "#0f766e",
        mint: "#ccfbf1",
        sun: "#f59e0b",
        cloud: "#f6f8fb"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(16,32,39,.09)"
      }
    }
  },
  plugins: []
} satisfies Config;
