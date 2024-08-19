import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // ログインページに移動
  await page.goto("/login");
  // メールアドレスとパスワードを入力
  await page.getByRole("textbox", { name: /メールアドレス/ }).fill(process.env.TEST_CREDENTIALS_EMAIL as string);
  await page.getByRole("textbox", { name: /パスワード/ }).fill(process.env.TEST_CREDENTIALS_PASSWORD as string);
  // ログインボタンをクリック
  await page.getByRole("button", { name: /^ログイン$/ }).click();
});

// ログアウトのテスト
test("should logout", async ({ page }) => {
  await page.getByRole("button", { name: "User Image" }).click();
  await page.getByRole("button", { name: "ログアウト" }).click();
  await expect(page).toHaveURL("/login");
});


