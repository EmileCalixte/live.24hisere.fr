import { expect, test } from "@playwright/test";
import { getTrackedUmamiEvents, mockUmami } from "../../helpers/umami";

test("theme follows system preference by default", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/races");
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");

  await page.evaluate(() => { localStorage.clear(); });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/races");
  await expect(page.locator("body")).toHaveAttribute("data-theme", "light");
});

test("theme can be toggled manually and persists across reloads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/races");
  await expect(page.locator("body")).toHaveAttribute("data-theme", "light");

  const themeButton = page.getByRole("button", { name: /Utiliser le thème (sombre|clair)/ });

  await themeButton.click();
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");
});

test("theme auto-switches when system preference changes while page is open", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/races");
  await expect(page.locator("body")).toHaveAttribute("data-theme", "light");

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveAttribute("data-theme", "light");
});

test("manual theme switch sends a umami event", async ({ page }) => {
  await mockUmami(page);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/races");

  const themeButton = page.getByRole("button", { name: /Utiliser le thème (sombre|clair)/ });
  await themeButton.click();
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");

  await expect.poll(async () => await getTrackedUmamiEvents(page)).toContain("Manual switch to dark theme");
});

test("automatic theme switch sends a umami event", async ({ page }) => {
  await mockUmami(page);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/races");
  await expect(page.locator("body")).toHaveAttribute("data-theme", "light");

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");

  await expect.poll(async () => await getTrackedUmamiEvents(page)).toContain("Auto switch to dark theme");
});
