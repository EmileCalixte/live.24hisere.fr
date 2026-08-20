import { expect, test } from "@playwright/test";

test("admin page stays on /admin when authenticated", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin(\/.*)?$/);
});
