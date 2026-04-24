import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

const htmlReport = ["html", { outputFolder: "./test-e2e/playwright-report", open: "never" }] as const;
const githubReport = ["github"] as const;

const reporter: PlaywrightTestConfig["reporter"] = isCI ? [githubReport, htmlReport] : [htmlReport];

export default defineConfig({
  testDir: "./test-e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI && { workers: 1 }),
  reporter,
  outputDir: "./test-e2e/test-results",
  use: {
    baseURL: frontendUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: isCI ? "pnpm run preview" : "pnpm run dev",
    url: frontendUrl,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
