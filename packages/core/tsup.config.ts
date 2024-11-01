import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    constants: "./src/constants/index.ts",
    types: "./src/types/index.ts",
  },
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
});
