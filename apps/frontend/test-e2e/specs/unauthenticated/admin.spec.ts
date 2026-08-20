import { expect, test } from "@playwright/test";

test("admin page redirects away from /admin when not authenticated", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).not.toHaveURL(/\/admin(\/.*)?$/);
});
