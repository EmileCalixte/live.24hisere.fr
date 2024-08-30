import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        types: "./src/index.ts",
    },
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: false,
    clean: true,
});
