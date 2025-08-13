import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

// 有効なメールアドレスとパスワードでログインできる
test("should successfully log in", async ({ page }) => {
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
  await expect(page.getByText(/ログインに成功しました/)).toBeVisible();
  await expect(page.getByText("Hello, kensuke")).toBeVisible();
});

// 無効なメールアドレスとパスワードでログインしようとしたらエラーメッセージが表示される
test("should display an error message when trying to log in with an invalid email and password", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "メールアドレス" }).fill("invalid@example.com");
  await page.getByRole("textbox", { name: "パスワード" }).fill("invalidpassword");
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/login");
  await expect(page.getByText(/ログインに成功しました/)).not.toBeVisible();
  await expect(page.getByText("ログインに失敗しました")).toBeVisible();
});

// ログイン時にログインページに遷移しようとしたらトップページへリダイレクトされる
test("should redirect to the home page when accessing the login page while already logged in", async ({
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
