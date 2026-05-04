import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    exclude: [...defaultExclude, "test-e2e/**"],
  },
});
