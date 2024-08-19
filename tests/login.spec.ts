import { test, expect } from "@playwright/test";

// test("ログインページの表示テスト", async ({ page }) => {
//   await page.goto("/login")
//   await expect(page).toHaveTitle(/^ログイン \| NextBlogApp$/)
//   await expect(page.getByRole("heading")).toHaveText(/Playwrightのハンズオン/)
//   await expect(page.getByRole("button", { name: /操作ボタン/ })).toBeVisible()
// });

// ログインページへの遷移
test("navigating to the login page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "ログイン" }).click();
  await expect(page).toHaveURL("http://localhost:3000/login")
  await expect(page).toHaveTitle(/^ログイン \| NextBlogApp$/)
});

// ユーザーがログインしている場合、トップページにリダイレクトする
test("redirects to top page if user is logged in", async ({ page }) => {
  // ログインページに移動
  await page.goto("/login");

  // メールアドレスとパスワードを入力
  await page.getByRole("textbox", { name: /メールアドレス/ }).fill(process.env.TEST_CREDENTIALS_EMAIL as string);
  await page.getByRole("textbox", { name: /パスワード/ }).fill(process.env.TEST_CREDENTIALS_PASSWORD as string);

  // ログインボタンをクリック
  await page.getByRole("button", { name: /^ログイン$/ }).click();
  await page.waitForURL("/");

  // ログインページにアクセス
  await page.goto("/login");

  // トップページにリダイレクトされるか確認
  await page.waitForURL("/");
  expect(page.url()).toBe("http://localhost:3000/");
});

// 認証のテスト
test.describe("Authentication Tests", () => {
  // Google認証のテスト
  test("Google Authentication", async ({ page }) => {
    // Googleログインページに移動
    await page.goto("/login");
    // Googleのログインボタンをクリック
    await page.getByRole("button", { name: /Googleでログインする/ }).click();
    // Google認証ページが開かれるはずなので、URLをチェック
    await expect(page).toHaveURL(/accounts\.google\.com/);
    // 認証ページが正常に表示されるか確認
    await expect(page).toHaveTitle(/Google/);
  });

  // GitHub認証のテスト
  test("GitHub Authentication", async ({ page }) => {
    // GitHubログインページに移動
    await page.goto("/login");
    // GitHubのログインボタンをクリック
    await page.getByRole("button", { name: /GitHubでログインする/ }).click();
    // GitHub認証ページが開かれるはずなので、URLをチェック
    await expect(page).toHaveURL(/github\.com\/login/);
    // 認証ページが正常に表示されるか確認
    await expect(page).toHaveTitle(/Sign in to GitHub/);
  });

  // メールアドレスとパスワードを用いたCredentials認証のテスト
  test("Credentials Authentication", async ({ page }) => {
    // ログインページに移動
    await page.goto("/login");
    // メールアドレスとパスワードを入力
    await page.getByRole("textbox", { name: /メールアドレス/ }).fill(process.env.TEST_CREDENTIALS_EMAIL as string);
    await page.getByRole("textbox", { name: /パスワード/ }).fill(process.env.TEST_CREDENTIALS_PASSWORD as string);
    // ログインボタンをクリック
    await page.getByRole("button", { name: /^ログイン$/ }).click();
    // 認証成功後のリダイレクトを確認
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
    // ログインに成功したか確認
    await expect(page.getByRole("button", { name: "User Image" })).toBeVisible();
  });
});
