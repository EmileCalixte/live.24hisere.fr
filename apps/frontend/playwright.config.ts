import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);

const reporter: PlaywrightTestConfig["reporter"] = isCI
  ? "github"
  : [["html", { outputFolder: "./test-e2e/playwright-report", open: "never" }]];

export default defineConfig({
  testDir: "./test-e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI && { workers: 1 }),
  reporter,
  outputDir: "./test-e2e/test-results",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: isCI ? "pnpm run preview" : "pnpm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
