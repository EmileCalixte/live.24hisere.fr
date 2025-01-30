// We can't use `import "vitest"` because it's bundled into `require()` which does not work with vitest
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    visualizer({
      filename: "bundle-visualization.html",
      gzipSize: true,
    }),
  ],
  server: {
    host: true,
    port: 3000,
  },
});
