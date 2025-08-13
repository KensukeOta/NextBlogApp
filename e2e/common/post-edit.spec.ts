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
  await expect(page.getByText(/記事を更新しました/)).toBeVisible();
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
  await expect(page.getByText(/記事を更新しました/)).toBeVisible();
  await expect(page.getByRole("link", { name: editTitle })).toBeVisible();
  await expect(page.getByRole("link", { name: tagName })).toBeVisible();
});

// 最低文字数以下で入力した場合、バリデーションメッセージが表示される
test("should display a validation message when input is below the minimum character limit", async ({
  page,
}) => {
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

  const shortEditTitle = Array.from({ length: 2 }, () => Math.random().toString(36)[2]).join("");
  const shortEditContent = Array.from({ length: 9 }, () => Math.random().toString(36)[2]).join("");

  await page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("link", { name: "更新" })
    .click();
  await page.getByRole("textbox", { name: "タイトル" }).fill(shortEditTitle);
  await page.getByRole("textbox", { name: "本文" }).fill(shortEditContent);
  await page.getByRole("button", { name: "更新する" }).click();
  await expect(page.getByText(/記事を更新しました/)).not.toBeVisible();
  await expect(page.getByText("送信に失敗しました")).toBeVisible();
  await expect(page.getByText("3文字以上で入力してください")).toBeVisible();
  await expect(page.getByText("10文字以上で入力してください")).toBeVisible();
});

// 最高文字数以上で入力した場合、バリデーションメッセージが表示される
test("should display a validation message when input is below the maximum character limit", async ({
  page,
}) => {
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

  const longEditTitle = Array.from({ length: 51 }, () => Math.random().toString(36)[2]).join("");
  const longEditContent = Array.from({ length: 10001 }, () => Math.random().toString(36)[2]).join(
    "",
  );

  await page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("link", { name: "更新" })
    .click();
  await page.getByRole("textbox", { name: "タイトル" }).fill(longEditTitle);
  await page.getByRole("textbox", { name: "本文" }).fill(longEditContent);
  await page.getByRole("button", { name: "更新する" }).click();
  await expect(page.getByText(/記事を更新しました/)).not.toBeVisible();
  await expect(page.getByText("送信に失敗しました")).toBeVisible();
  await expect(page.getByText("50文字以内で入力してください")).toBeVisible();
  await expect(page.getByText("10000文字以内で入力してください")).toBeVisible();
});

// 未ログイン時に記事更新ページに遷移しようとしたらトップページへリダイレクトされる
test("should redirect to the home page when trying to access the post edit page while not logged in", async ({
  page,
}) => {
  await page.goto(`/${process.env.TEST_USER_NAME}/posts/123/edit`);
  await expect(page).toHaveURL("/");
});
