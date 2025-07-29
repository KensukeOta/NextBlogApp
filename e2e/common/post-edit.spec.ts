import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
import { postCreate } from "../helpers/post-create";

// 有効なタイトルと本文で記事の更新ができる
test("should be able to update a post with a valid title and content", async ({ page }) => {
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

  const editTitle = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const editContent = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("link", { name: "更新" })
    .click();
  await expect(page).toHaveTitle("記事更新フォーム - NextBlogApp");
  await page.getByRole("textbox", { name: "タイトル" }).fill(editTitle);
  await page.getByRole("textbox", { name: "本文" }).fill(editContent);
  await page.getByRole("button", { name: "更新する" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: editTitle })).toBeVisible();
});

// 有効なタイトルと本文とタグで記事の更新ができる
test("should be able to update a post with a valid title, content, and tags", async ({ page }) => {
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

  const editTitle = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const editContent = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");
  const tagName = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");

  await page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("link", { name: "更新" })
    .click();
  await page.getByRole("textbox", { name: "タイトル" }).fill(editTitle);
  await page.getByTestId("input").fill(tagName);
  await page.getByTestId("input").press("Enter");
  await page.getByRole("textbox", { name: "本文" }).fill(editContent);
  await page.getByRole("button", { name: "更新する" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: editTitle })).toBeVisible();
  await expect(page.getByRole("link", { name: tagName })).toBeVisible();
});

// 未ログイン時に記事更新ページに遷移しようとしたらトップページへリダイレクトされる
test("should redirect to the home page when trying to access the post edit page while not logged in", async ({
  page,
}) => {
  await page.goto(`/${process.env.TEST_USER_NAME}/posts/123/edit`);
  await expect(page).toHaveURL("/");
});
