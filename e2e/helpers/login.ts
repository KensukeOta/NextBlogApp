import { expect, Page } from "@playwright/test";

// ログイン処理
export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
  await page.getByRole("textbox", { name: "パスワード" }).fill(password);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/");
}
