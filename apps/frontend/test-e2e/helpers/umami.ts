import type { Page } from "@playwright/test";

declare global {
  interface Window {
    __umamiTrackedEvents: string[];
  }
}

/**
 * The real umami script isn't served in dev/e2e test envs, so trackEvent() calls would fail.
 * Stubs window.umami before any page script runs, and blocks the script tag so a real umami
 * instance (e.g. running locally) can't overwrite the stub.
 */
export async function mockUmami(page: Page): Promise<void> {
  await page.route("**/script.js", async (route) => { await route.abort(); });

  await page.addInitScript(() => {
    window.__umamiTrackedEvents = [];
    window.umami = {
      track: async (eventName: string) => {
        window.__umamiTrackedEvents.push(eventName);
        return await Promise.resolve("");
      },
      identify: async () => { await Promise.resolve(); },
    };
  });
}

export async function getTrackedUmamiEvents(page: Page): Promise<string[]> {
  return await page.evaluate(() => window.__umamiTrackedEvents);
}
