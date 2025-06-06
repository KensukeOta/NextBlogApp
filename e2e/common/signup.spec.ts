import { test, expect } from "@playwright/test";

// 認証されたユーザがログインページに移動すると、トップページにリダイレクトされる
test("authenticated users are redirected to the top page when they go to the signup page", async ({
  page,
}) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL as string);
  await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD as string);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");
  await page.goto("/signup");
  await expect(page).toHaveURL("/");
});
