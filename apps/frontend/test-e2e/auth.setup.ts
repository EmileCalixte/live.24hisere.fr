import { expect, test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Nom d'utilisateur").fill("Admin");
  await page.getByLabel("Mot de passe").fill("admin");
  await page.getByRole("button", { name: "Connexion" }).click();
  await expect(page).toHaveURL(/\/admin/);
  await page.context().storageState({ path: "./test-e2e/.auth/user.json" });
});
