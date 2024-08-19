import { test, expect } from "@playwright/test";

test('should post show', async ({ page }) => {
  // ログインページに移動
  await page.goto("/login");

  // メールアドレスとパスワードを入力
  await page.getByRole("textbox", { name: /メールアドレス/ }).fill(process.env.TEST_CREDENTIALS_EMAIL as string);
  await page.getByRole("textbox", { name: /パスワード/ }).fill(process.env.TEST_CREDENTIALS_PASSWORD as string);

  // ログインボタンをクリック
  await page.getByRole("button", { name: /^ログイン$/ }).click();

  // 投稿フォームに遷移
  await page.getByRole("link", { name: "投稿する" }).click();

  await page.getByPlaceholder("タイトル").fill("Hello World");
  await page.getByPlaceholder("本文").fill("Hello World!");
  await page.evaluate(() => {
    const hiddenInput = document.querySelector('input[type="hidden"][name="user_id"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = "1";
    }
  });
  
  await page.getByRole("button", { name: "投稿する" }).click();

  // 記事詳細表示機能のテスト
  await page.getByRole("link", { name: "Hello World" }).first().click();
  await page.waitForURL("**/posts/*");
  await expect(page.getByRole("heading", { name: "Hello World", exact: true })).toBeVisible();
  await expect(page.getByText("Hello World!")).toBeVisible();
  await expect(page).toHaveTitle(/^Hello World \| NextBlogApp$/);
});