import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
import { postCreate } from "../helpers/post-create";

// 記事削除ダイアログでOKを押すと記事が削除される
test("should delete the post when OK is clicked in the delete confirmation dialog", async ({
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

  // confirmダイアログに対してOKを押す処理を設定
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm"); // confirmダイアログか確認
    expect(dialog.message()).toBe("この記事を削除しますか？"); // ダイアログのメッセージを確認
    await dialog.accept(); // OKを選択
  });

  await page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("button", { name: "削除" })
    .click();

  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
});

// 記事削除ダイアログでキャンセルを押すと記事は削除されない
test("should not delete the post when Cancel is clicked in the delete confirmation dialog", async ({
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

  // confirmダイアログに対して「キャンセル」を押す
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toBe("この記事を削除しますか？");
    await dialog.dismiss(); // ← キャンセル（Cancel）を選択
  });

  // 削除ボタンをクリック
  await page
    .getByRole("article")
    .filter({ hasText: `${title}` })
    .getByRole("button", { name: "削除" })
    .click();

  // 記事がまだ存在することを確認
  await expect(page.getByRole("link", { name: title })).toBeVisible();
});
