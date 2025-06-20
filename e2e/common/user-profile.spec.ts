import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

// ユーザーのプロフィールページに行くことができる
test("can see user profile page", async ({ page }) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
  await expect(page).toHaveTitle(
    `${decodeURIComponent(process.env.TEST_USER_NAME as string)} - NextBlogApp`,
  );
  await expect(
    page.getByRole("heading", { name: decodeURIComponent(process.env.TEST_USER_NAME as string) }),
  ).toBeVisible();
});
