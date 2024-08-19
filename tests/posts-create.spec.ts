import { test, expect } from "@playwright/test";

// ユーザーがログインしていない場合、ログインページにリダイレクトする
test("redirects to login page if user is not logged in", async ({ page }) => {
  // 記事作成ページにアクセス
  await page.goto("/posts/create");

  // ログインページにリダイレクトされるか確認
  await page.waitForURL("/login");
  expect(page.url()).toBe("http://localhost:3000/login");
});

test("should post create", async ({ page }) => {
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

  // 投稿成功後のリダイレクトを確認
  await page.waitForURL("/");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: "Hello World", exact: true }).first()).toBeVisible();
});
