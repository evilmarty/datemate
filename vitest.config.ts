/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
    coverage: {
      reporter: ["text", "json"],
      exclude: [
        "**/node_modules/**",
        "*.config.js",
        "*.config.ts",
        "./src/main.tsx",
        "coverage/**",
        "dist/**",
      ],
    },
  },
});
