import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup/setup.ts",
    coverage: {
      provider: "istanbul", // Use istanbul for coverage
      reporter: ["text", "json", "html"], // Generate coverage reports in multiple formats
      exclude: ["node_modules/", "src/test/"], // Exclude certain directories from coverage
    },
    watch: true,
    include: ["src/**/*.test.{ts,tsx}"], // Include test files
    exclude: ["node_modules", "dist"], // Exclude certain directories from tests
  },

  server: {
    port: 8000, // Set the development server port
    open: true, // Automatically open the browser on server start
  },
  build: {
    sourcemap: true, // Generate source maps for easier debugging
  },
});
