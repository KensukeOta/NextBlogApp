import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
// 有効なタイトルと本文で記事投稿できる
test("can post create and see top page", async ({ page }) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  const title = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const content = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/posts/create");
  await expect(page).toHaveTitle("記事投稿フォーム - NextBlogApp");
  await page.getByRole("textbox", { name: "タイトル" }).fill(title);
  await page.getByRole("textbox", { name: "本文" }).fill(content);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
});

// 有効なタイトルと本文とタグで記事投稿できる
test("can post and tag create and see top page", async ({ page }) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  const title = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const content = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");
  const tagName = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/posts/create");
  await page.getByRole("textbox", { name: "タイトル" }).fill(title);
  await page.getByTestId("input").fill(tagName);
  await page.getByTestId("input").press("Enter");
  await page.getByRole("textbox", { name: "本文" }).fill(content);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
  await expect(page.getByRole("link", { name: tagName })).toBeVisible();
});

// 最低文字数以下で入力した場合、バリデーションメッセージが表示される
test("can't post create with invalid short value", async ({ page }) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  const shortTitle = Array.from({ length: 2 }, () => Math.random().toString(36)[2]).join("");
  const shortContent = Array.from({ length: 9 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/posts/create");
  await page.getByRole("textbox", { name: "タイトル" }).fill(shortTitle);
  await page.getByRole("textbox", { name: "本文" }).fill(shortContent);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/posts/create");
  await expect(page.getByText("送信に失敗しました")).toBeVisible();
  await expect(page.getByText("3文字以上で入力してください")).toBeVisible();
  await expect(page.getByText("10文字以上で入力してください")).toBeVisible();
});

// 最高文字数以上で入力した場合、バリデーションメッセージが表示される
test("can't post create with invalid long value", async ({ page }) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  const longTitle = Array.from({ length: 51 }, () => Math.random().toString(36)[2]).join("");
  const longContent = Array.from({ length: 10001 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/posts/create");
  await page.getByRole("textbox", { name: "タイトル" }).fill(longTitle);
  await page.getByRole("textbox", { name: "本文" }).fill(longContent);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/posts/create");
  await expect(page.getByText("送信に失敗しました")).toBeVisible();
  await expect(page.getByText("50文字以内で入力してください")).toBeVisible();
  await expect(page.getByText("10000文字以内で入力してください")).toBeVisible();
});

// 未ログインユーザが記事投稿ページに移動すると、ログインページにリダイレクトされる
test("unauthenticated users are redirected to the login page when they go to the post create page", async ({
  page,
}) => {
  await page.goto("/posts/create");
  await expect(page).toHaveURL("/login");
});
