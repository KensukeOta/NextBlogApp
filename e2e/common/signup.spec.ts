import { test, expect } from "@playwright/test";

// 有効なユーザー名とメールアドレスとパスワードとパスワード確認でサインアップできる
test("can signup and see top page", async ({ page }) => {
  const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
  const email = `testuser+${uniqueSuffix}@example.com`;
  const name = `TestUser${uniqueSuffix}`;

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
  await page.goto("/login");
  await page
    .getByRole("textbox", { name: "メールアドレス" })
    .fill(process.env.TEST_USER_EMAIL as string);
  await page
    .getByRole("textbox", { name: "パスワード" })
    .fill(process.env.TEST_USER_PASSWORD as string);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/signup");
  await expect(page).toHaveURL("/");
});
