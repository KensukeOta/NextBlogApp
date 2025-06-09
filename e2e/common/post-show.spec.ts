import { test, expect } from "@playwright/test";

// 記事詳細ページで記事のコンテンツを見ることができる
test("can show post page", async ({ page }) => {
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

  await page.getByRole("link", { name: title }).click();
  await expect(page).toHaveTitle(`${title} - NextBlogApp`);

  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(`by${process.env.TEST_USER_NAME}`)).toBeVisible();
  await expect(page.getByText(content)).toBeVisible();
});
