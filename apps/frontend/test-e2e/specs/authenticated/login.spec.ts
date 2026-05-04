import { expect, test } from "@playwright/test";

test("login page redirects to admin when authenticated", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/admin(\/.*)?$/);
});
