// We can't use `import "vitest"` because it's bundled into `require()` which does not work with vitest
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    plugins: [
        react(),
    ],
    server: {
        host: true,
        port: 80,
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./test/setup.ts",
    },
});
