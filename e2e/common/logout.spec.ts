import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

// ログアウトができる
test("can logout and see login page", async ({ page }) => {
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );
  await page.getByRole("button", { name: "ユーザーメニューを開く" }).click();
  await page.getByRole("button", { name: "ログアウト" }).click();
  await expect(page).toHaveURL("/login");
});
