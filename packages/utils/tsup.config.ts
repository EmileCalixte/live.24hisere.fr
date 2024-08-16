import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        "test-utils": "./src/test-utils/index.ts",
    },
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: false,
    clean: true,
});
