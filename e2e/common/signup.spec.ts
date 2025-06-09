import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

// 有効なユーザー名とメールアドレスとパスワードとパスワード確認でサインアップできる
test("can signup and see top page", async ({ page }) => {
  const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
  const name = `TestUser${uniqueSuffix}`;
  const email = `testuser+${uniqueSuffix}@example.com`;

  await page.goto("/signup");
  await expect(page).toHaveTitle("サインアップ - NextBlogApp");
  await page.getByRole("textbox", { name: "名前" }).fill(name);
  await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
  await page.getByRole("textbox", { name: "パスワード", exact: true }).fill("password123");
  await page.getByRole("textbox", { name: "パスワード確認" }).fill("password123");
  await page.getByRole("button", { name: "登録" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByText(`Hello, ${name}`)).toBeVisible();
});

// 最低文字数以下で入力した場合、バリデーションメッセージが表示される
test("can't signup with invalid short value", async ({ page }) => {
  const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
  const email = `testuser+${uniqueSuffix}@example.com`;
  const shortName = Math.random().toString(36).slice(-2);
  const shortPassword = Math.random().toString(36).slice(-7);

  await page.goto("/signup");
  await expect(page).toHaveTitle("サインアップ - NextBlogApp");
  await page.getByRole("textbox", { name: "名前" }).fill(shortName);
  await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
  await page.getByRole("textbox", { name: "パスワード", exact: true }).fill(shortPassword);
  await page.getByRole("textbox", { name: "パスワード確認" }).fill(shortPassword);
  await page.getByRole("button", { name: "登録" }).click();
  await expect(page).toHaveURL("/signup");
  await expect(page.getByText("送信に失敗しました")).toBeVisible();
  await expect(page.getByText("3文字以上で入力してください")).toBeVisible();
  await expect(page.getByText("8文字以上で入力してください")).toHaveCount(2);
});

// 最高文字数以上で入力した場合、バリデーションメッセージが表示される
test("can't signup with invalid long value", async ({ page }) => {
  const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
  const email = `testuser+${uniqueSuffix}@example.com`;
  const longName = Array.from({ length: 33 }, () => Math.random().toString(36)[2]).join("");
  const longPassword = Array.from({ length: 65 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/signup");
  await expect(page).toHaveTitle("サインアップ - NextBlogApp");
  await page.getByRole("textbox", { name: "名前" }).fill(longName);
  await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
  await page.getByRole("textbox", { name: "パスワード", exact: true }).fill(longPassword);
  await page.getByRole("textbox", { name: "パスワード確認" }).fill(longPassword);
  await page.getByRole("button", { name: "登録" }).click();
  await expect(page).toHaveURL("/signup");
  await expect(page.getByText("送信に失敗しました")).toBeVisible();
  await expect(page.getByText("32文字以内で入力してください")).toBeVisible();
  await expect(page.getByText("64文字以内で入力してください")).toHaveCount(2);
});

// パスワードとパスワード確認が一致しないとバリデーションメッセージが表示される
test("can't signup with password and password_confirmation do not match", async ({ page }) => {
  const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
  const name = `TestUser${uniqueSuffix}`;
  const email = `testuser+${uniqueSuffix}@example.com`;

  await page.goto("/signup");
  await expect(page).toHaveTitle("サインアップ - NextBlogApp");
  await page.getByRole("textbox", { name: "名前" }).fill(name);
  await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
  await page.getByRole("textbox", { name: "パスワード", exact: true }).fill("password123");
  await page.getByRole("textbox", { name: "パスワード確認" }).fill("different123");
  await page.getByRole("button", { name: "登録" }).click();
  await expect(page).toHaveURL("/signup");
  await expect(page.getByText("送信に失敗しました")).toBeVisible();
  await expect(page.getByText("パスワードが一致しません")).toBeVisible();
});

// ユーザー名が重複していたらエラーメッセージが表示される
// test("can't signup with duplicate name", async ({ page }) => {
//   let uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
//   let email = `testuser+${uniqueSuffix}@example.com`;
//   const name = `TestUser${uniqueSuffix}`;

//   uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
//   email = `testuser+${uniqueSuffix}@example.com`;

//   await page.goto("/signup");
//   await page.getByRole("textbox", { name: "名前" }).fill(name);
//   await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
//   await page.getByRole("textbox", { name: "パスワード", exact: true }).fill("password123");
//   await page.getByRole("textbox", { name: "パスワード確認" }).fill("password123");
//   await page.getByRole("button", { name: "登録" }).click();
//   await expect(page).toHaveURL("/");

//   await page.getByRole("button", { name: "ユーザーメニューを開く" }).click();
//   await page.getByRole("button", { name: "ログアウト" }).click();
//   await expect(page).toHaveURL("/login");

//   uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
//   email = `testuser+${uniqueSuffix}@example.com`;

//   await page.goto("/signup");
//   await expect(page.getByLabel("名前")).toBeVisible();
//   await page.getByRole("textbox", { name: "名前" }).fill(name);
//   await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
//   await page.getByRole("textbox", { name: "パスワード", exact: true }).fill("password123");
//   await page.getByRole("textbox", { name: "パスワード確認" }).fill("password123");
//   await page.getByRole("button", { name: "登録" }).click();
//   await expect(page).toHaveURL("/signup");
//   await expect(page.getByText("この名前は既に使用されています")).toBeVisible();
// });

// 認証されたユーザがサインアップページに移動すると、トップページにリダイレクトされる
test("authenticated users are redirected to the top page when they go to the signup page", async ({
  page,
}) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  await page.goto("/signup");
  await expect(page).toHaveURL("/");
});
