import { test, expect } from "@playwright/test";

// 記事削除ダイアログでOKを押すと記事が削除される
test("If OK is pressed in the Delete dialog, the article is deleted", async ({ page }) => {
  // ログイン処理
  await page.goto("/login");
  await page
    .getByRole("textbox", { name: "メールアドレス" })
    .fill(process.env.TEST_USER_EMAIL as string);
  await page
    .getByRole("textbox", { name: "パスワード" })
    .fill(process.env.TEST_USER_PASSWORD as string);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/");

  const title = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const content = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/posts/create");
  await page.getByRole("textbox", { name: "タイトル" }).fill(title);
  await page.getByRole("textbox", { name: "本文" }).fill(content);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/");

  // confirmダイアログに対してOKを押す処理を設定
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm"); // confirmダイアログか確認
    expect(dialog.message()).toBe("この記事を削除しますか？"); // ダイアログのメッセージを確認
    await dialog.accept(); // OKを選択
  });

  await page
    .getByRole("article")
    .filter({ hasText: `${title}by ${process.env.TEST_USER_NAME}更新削除` })
    .getByRole("button", { name: "削除" })
    .nth(0)
    .click();

  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
});

// 記事削除ダイアログでキャンセルを押すと記事は削除されない
test("If Cancel is pressed in the Delete dialog, the article is not deleted", async ({ page }) => {
  // ログイン処理
  await page.goto("/login");
  await page
    .getByRole("textbox", { name: "メールアドレス" })
    .fill(process.env.TEST_USER_EMAIL as string);
  await page
    .getByRole("textbox", { name: "パスワード" })
    .fill(process.env.TEST_USER_PASSWORD as string);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/");

  // テスト用記事作成
  const title = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");
  const content = Array.from({ length: 100 }, () => Math.random().toString(36)[2]).join("");

  await page.goto("/posts/create");
  await page.getByRole("textbox", { name: "タイトル" }).fill(title);
  await page.getByRole("textbox", { name: "本文" }).fill(content);
  await page.getByRole("button", { name: "投稿する" }).click();
  await expect(page).toHaveURL("/");

  // confirmダイアログに対して「キャンセル」を押す
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toBe("この記事を削除しますか？");
    await dialog.dismiss(); // ← キャンセル（Cancel）を選択
  });

  // 削除ボタンをクリック
  await page
    .getByRole("article")
    .filter({ hasText: `${title}by ${process.env.TEST_USER_NAME}更新削除` })
    .getByRole("button", { name: "削除" })
    .nth(0)
    .click();

  // 記事がまだ存在することを確認
  await expect(page.getByRole("link", { name: title })).toBeVisible();
});
