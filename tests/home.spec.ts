import { test, expect } from "@playwright/test";

// トップページへの遷移
test("navigating to the signup page", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/^NextBlogApp$/)
  // await expect(page.getByRole("heading")).toHaveText(/Playwrightのハンズオン/)
  // await expect(page.getByRole("button", { name: /操作ボタン/ })).toBeVisible()
});
