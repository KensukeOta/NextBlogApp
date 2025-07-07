import { expect, Page } from "@playwright/test";

// ユーザーSNS情報更新処理
export async function updateUserSNS(
  page: Page,
  twitterURL: string,
  instagramURL: string,
  youtubeURL: string,
) {
  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
  await page.getByRole("button", { name: /プロフィールを編集/ }).click();
  await page.getByRole("tab", { name: "SNS" }).click();
  await page.getByRole("textbox", { name: /X \(Twitter\)/ }).fill(twitterURL);
  await page.getByRole("textbox", { name: /Instagram/ }).fill(instagramURL);
  await page.getByRole("textbox", { name: /YouTube/ }).fill(youtubeURL);
  await page.getByRole("button", { name: "変更を保存" }).click();
  await expect(page).toHaveURL(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
}
