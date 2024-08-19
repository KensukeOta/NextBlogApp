import { test, expect } from "@playwright/test";

test("should post delete", async ({ page }) => {
  // ログインページに移動
  await page.goto("/login");

  // メールアドレスとパスワードを入力
  await page.getByRole("textbox", { name: /メールアドレス/ }).fill(process.env.TEST_CREDENTIALS_EMAIL as string);
  await page.getByRole("textbox", { name: /パスワード/ }).fill(process.env.TEST_CREDENTIALS_PASSWORD as string);

  // ログインボタンをクリック
  await page.getByRole("button", { name: /^ログイン$/ }).click();

  // 投稿フォームに遷移
  await page.getByRole("link", { name: "投稿する" }).click();

  await page.getByPlaceholder("タイトル").fill("Title");
  await page.getByPlaceholder("本文").fill("Body");
  await page.evaluate(() => {
    const hiddenInput = document.querySelector('input[type="hidden"][name="user_id"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = "1";
    }
  });

  await page.getByRole("button", { name: "投稿する" }).click();

  // 記事削除機能のテスト

  // confirmダイアログに対してOKを押す処理を設定
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm'); // confirmダイアログか確認
    expect(dialog.message()).toBe('この記事を削除しますか？'); // ダイアログのメッセージを確認
    await dialog.accept(); // OKを選択
  });

  // 削除ボタンをクリック (getByRoleを使用)
  await page.getByRole('button', { name: '削除' }).first().click();

  // 削除後の確認 (例: 記事が削除され、一覧に表示されなくなったことを確認)
  await expect(page.getByRole("link", { name: "Title" })).not.toBeVisible();
});