import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
import { postCreate } from "../helpers/post-create";

// ユーザーのプロフィールページに行くことができる
test("should be able to visit the user's profile page", async ({ page }) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}/likes`);
  await expect(page).toHaveTitle(
    `${decodeURIComponent(process.env.TEST_USER_NAME as string)} - NextBlogApp`,
  );
  await expect(
    page.getByRole("heading", { name: decodeURIComponent(process.env.TEST_USER_NAME as string) }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "いいねした記事" })).toBeVisible();
});

// いいねボタンをクリックしたら数字がインクリメントする
test("should increment the like count when the like button is clicked", async ({ page }) => {
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  // 記事作成処理
  const title = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const content = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await postCreate(page, title, content);

  // いいね数を取得
  const likeCountLocator = page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByTestId("like-count");
  const before = await likeCountLocator.textContent();
  const beforeCount = Number(before);

  // いいねボタンをクリック
  await page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("button", { name: "いいねする" })
    .click();

  // いいね数が1増えていることを検証
  await expect(likeCountLocator).toHaveText(String(beforeCount + 1));
  await expect(page.getByText(/いいねしました/)).toBeVisible();

  // いいねボタンをクリック（いいね取り消し）
  const unlikeButton = page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("button", { name: "いいねを取り消す" });
  await unlikeButton.click();

  // いいね数が元に戻ることを検証
  await expect(likeCountLocator).toHaveText(String(beforeCount));
  await expect(page.getByText(/いいねを取り消しました/)).toBeVisible();
});
