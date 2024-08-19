import { test, expect } from "@playwright/test";

// test("サインアップページの表示テスト", async ({ page }) => {
//   await page.goto("/signup")
//   await expect(page.getByRole("heading")).toHaveText(/Playwrightのハンズオン/)
//   await expect(page.getByRole("button", { name: /操作ボタン/ })).toBeVisible()
// });

// サインアップページへの遷移
test('navigating to the signup page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '新規登録' }).click();
  await expect(page).toHaveURL("http://localhost:3000/signup");
  await expect(page).toHaveTitle(/^サインアップ \| NextBlogApp$/);
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

  // サインアップページにアクセス
  await page.goto("/signup");

  // トップページにリダイレクトされるか確認
  await page.waitForURL("/");
  expect(page.url()).toBe("http://localhost:3000/");
});
