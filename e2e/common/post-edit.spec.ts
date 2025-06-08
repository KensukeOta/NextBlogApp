import { test, expect } from "@playwright/test";

// 有効なタイトルと本文で記事の更新ができる
test("can post edit and see top page", async ({ page }) => {
  // ログイン処理
  await page.goto("/login");
  await page
    .getByRole("textbox", { name: "メールアドレス" })
    .fill(process.env.TEST_USER_EMAIL as string);
  await page
    .getByRole("textbox", { name: "パスワード" })
    .fill(process.env.TEST_USER_PASSWORD as string);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/");

  const title = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const content = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/posts/create");
  await page.getByRole("textbox", { name: "タイトル" }).fill(title);
  await page.getByRole("textbox", { name: "本文" }).fill(content);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/");

  const editTitle = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const editContent = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await page
    .getByRole("article")
    .filter({ hasText: `${title}by ${process.env.TEST_USER_NAME}更新削除` })
    .getByRole("link")
    .nth(1)
    .click();
  await expect(page).toHaveTitle("記事更新フォーム - NextBlogApp");
  await page.getByRole("textbox", { name: "タイトル" }).fill(editTitle);
  await page.getByRole("textbox", { name: "本文" }).fill(editContent);
  await page.getByRole("button", { name: "更新する" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: editTitle })).toBeVisible();
});

// 未ログインユーザが記事更新ページに移動すると、トップページにリダイレクトされる
test("umauthenticated users are redirected to the top page when they go to the post edit page", async ({
  page,
}) => {
  await page.goto(`/${process.env.TEST_USER_NAME}/posts/123/edit`);
  await expect(page).toHaveURL("/");
});
