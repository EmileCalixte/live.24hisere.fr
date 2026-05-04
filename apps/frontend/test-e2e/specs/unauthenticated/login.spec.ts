import { expect, test } from "@playwright/test";

test("login page is accessible", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveTitle(/^Connexion/);
  await expect(page.getByRole("heading", { name: "Connexion", level: 1 })).toBeVisible();
  await expect(page.getByLabel("Nom d'utilisateur")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
});
