import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Les 24 Heures de l'Isère/);
  await expect(page.getByText(/Dernière mise à jour des données/)).toBeVisible();
});
