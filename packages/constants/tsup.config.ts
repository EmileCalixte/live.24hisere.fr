import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        races: "./src/races/index.ts",
        runners: "./src/runners/index.ts",
        utils: "./src/utils/index.ts",
    },
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: false,
    clean: true,
});
