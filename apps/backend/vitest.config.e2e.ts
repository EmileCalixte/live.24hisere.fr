import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "./",
    include: ["test/e2e/**/*.e2e-spec.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- vite 8 types incompatibility
  plugins: [
    // This is required to build the test files with SWC
    swc.vite(),
  ],
});
