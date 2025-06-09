import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
import { postCreate } from "../helpers/post-create";

// 記事詳細ページで記事のコンテンツを見ることができる
test("can show post page", async ({ page }) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  // 記事作成処理
  const title = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const content = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await postCreate(page, title, content);

  await page.getByRole("link", { name: title }).click();
  await expect(page).toHaveTitle(`${title} - NextBlogApp`);

  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(`by${process.env.TEST_USER_NAME}`)).toBeVisible();
  await expect(page.getByText(content)).toBeVisible();
});
