// We can't use `import "vitest"` because it's bundled into `require()` which does not work with vitest
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type PluginOption } from "vite";
import { analyzer, unstableRolldownAdapter } from "vite-bundle-analyzer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    unstableRolldownAdapter(
      analyzer({
        analyzerMode: "static",
        fileName: "apps/frontend/bundle-visualization.html",
      }),
    ) as unknown as PluginOption,
  ],
  server: {
    host: true,
    port: 3000,
  },
});
