import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090b10",
        panel: "#111722",
        line: "#2a3444",
        good: "#65d6ad",
        warn: "#f2c36b",
        bad: "#f28b82"
      }
    }
  },
  plugins: []
};

export default config;
