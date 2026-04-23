import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    exclude: ["test-e2e/**", "node_modules/**"],
  },
});
