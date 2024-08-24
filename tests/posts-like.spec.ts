import { test, expect } from "@playwright/test";

test.describe("Like functionality tests", () => {
  test("should show alert if not logged in when liking a post", async ({ page }) => {
    // モックされたセッションを使わずに、いいねボタンをクリック
    await page.goto("/"); // 実際の投稿ページに移動
    const likeButton = page.getByRole("button", { name: "いいね" }).first();

    // いいねボタンをクリック
    page.on("dialog", dialog => {
      expect(dialog.message()).toBe("ログインすると「いいね」をすることができます！");
      dialog.accept();
    });
    await likeButton.click();
  });

  test("should like a post when logged in and not yet liked", async ({ page }) => {
    // ログインページに移動
    await page.goto("/login");

    // メールアドレスとパスワードを入力
    await page.getByRole("textbox", { name: /メールアドレス/ }).fill(process.env.TEST_CREDENTIALS_EMAIL as string);
    await page.getByRole("textbox", { name: /パスワード/ }).fill(process.env.TEST_CREDENTIALS_PASSWORD as string);

    // ログインボタンをクリック
    await page.getByRole("button", { name: /^ログイン$/ }).click();

    // 投稿フォームに遷移
    await page.getByRole("link", { name: "投稿する" }).click();

    await page.getByPlaceholder("タイトル").fill("Hello World");
    await page.getByPlaceholder("本文").fill("Hello World!");
    await page.evaluate(() => {
      const hiddenInput = document.querySelector('input[type="hidden"][name="user_id"]') as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = "1";
      }
    });

    await page.getByRole("button", { name: "投稿する" }).click();

    const likeButton = page.getByRole("button", { name: "いいね" }).first();

    // いいねボタンをクリック
    await likeButton.click();

    // いいねが追加されたことを確認
    await expect(likeButton).toHaveClass(/text-red-500/);
  });
});
