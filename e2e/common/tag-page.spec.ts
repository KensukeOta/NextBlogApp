import test, { expect } from "@playwright/test";
import { login } from "../helpers/login";

// タグページにタグに関連する記事が表示されている
test("should display posts related to the tag on the tag page", async ({ page }) => {
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

  await page.goto(`/tags/${encodeURIComponent(tagName)}`);
  await expect(
    page.getByRole("heading", { name: `#「${tagName}」と関連がある記事` }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: title })).toBeVisible();
  await expect(page.getByRole("link", { name: tagName })).toBeVisible();
});
