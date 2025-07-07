import { expect, Page } from "@playwright/test";

// ユーザー基本情報更新処理
export async function updateUserProfile(page: Page, name: string, bio: string) {
  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
  await page.getByRole("button", { name: /プロフィールを編集/ }).click();
  await page.getByRole("tab", { name: "基本情報" }).click();
  await page.getByRole("textbox", { name: "表示名" }).fill(name);
  await page.getByRole("textbox", { name: "自己紹介" }).fill(bio);
  await page.getByRole("button", { name: "変更を保存" }).click();
  await expect(page).toHaveURL(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
}
