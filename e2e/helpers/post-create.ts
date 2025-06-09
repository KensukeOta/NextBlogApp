import { expect, Page } from "@playwright/test";

// 記事作成処理
export async function postCreate(page: Page, title: string, content: string) {
  await page.goto("/posts/create");
  await page.getByRole("textbox", { name: "タイトル" }).fill(title);
  await page.getByRole("textbox", { name: "本文" }).fill(content);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/");
}
