import { test, expect } from "@playwright/test";

// ユーザーがログインしていない場合、ログインページにリダイレクトする
test("redirects to top page if user is not logged in", async ({ page }) => {
  const userName = "testuser"; // ユーザー名を設定
  const editPageUrl = `/${userName}/posts/1/edit`; // 動的URLを作成

  // 記事編集ページにアクセス
  await page.goto(editPageUrl);

  // トップページにリダイレクトされるか確認
  await page.waitForURL("/");
  expect(page.url()).toBe("http://localhost:3000/");
});

test("should post edit", async ({ page }) => {
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

  // 記事更新機能のテスト
  await page.getByRole("link", { name: "更新" }).first().click();
  await page.waitForURL("**/posts/**/edit");
  await page.getByPlaceholder("タイトル").fill("Hello World Update");
  await page.getByPlaceholder("本文").fill("Hello World update!");
  await page.getByRole("button", { name: "更新する" }).click();
  await page.waitForURL("/");

  await expect(page.getByRole("link", { name: "Hello World Update" }).first()).toBeVisible();
  await page.getByRole("link", { name: "Hello World Update" }).first().click();
  await page.waitForURL("**/posts/*");
  await expect(page.getByRole("heading", { name: "Hello World Update", exact: true })).toBeVisible();
  await expect(page.getByText("Hello World update!")).toBeVisible();
  await expect(page).toHaveTitle(/^Hello World Update \| NextBlogApp$/);
});
