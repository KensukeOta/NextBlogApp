import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

// 有効なメールアドレスとパスワードでログインできる
test("can login and see top page", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveTitle("ログイン - NextBlogApp");
  await page
    .getByRole("textbox", { name: "メールアドレス" })
    .fill(process.env.TEST_USER_EMAIL as string);
  await page
    .getByRole("textbox", { name: "パスワード" })
    .fill(process.env.TEST_USER_PASSWORD as string);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByText("Hello, kensuke")).toBeVisible();
});

// 無効なメールアドレスとパスワードでログインしようとしたらエラーメッセージが表示される
test("can't login with invalid username and password", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "メールアドレス" }).fill("invalid@example.com");
  await page.getByRole("textbox", { name: "パスワード" }).fill("invalidpassword");
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/login");
  await expect(page.getByText("ログインに失敗しました")).toBeVisible();
});

// 認証されたユーザがログインページに移動すると、トップページにリダイレクトされる
test("authenticated users are redirected to the top page when they go to the login page", async ({
  page,
}) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  await page.goto("/login");
  await expect(page).toHaveURL("/");
});
