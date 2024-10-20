import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        root: "./",
        include: ["test/e2e/**/*.e2e-spec.ts"],
        setupFiles: ["./vitest.setup.ts"],
    },
    plugins: [
        // This is required to build the test files with SWC
        swc.vite(),
    ],
});
