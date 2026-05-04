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
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/specs/unauthenticated/**/*.spec.ts",
    },
    {
      name: "authenticated",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./test-e2e/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: "**/specs/authenticated/**/*.spec.ts",
    },
  ],
  webServer: {
    command: isCI ? "pnpm run preview" : "pnpm run dev",
    url: frontendUrl,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
