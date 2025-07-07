import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
import { updateUserProfile } from "../helpers/user-profile-update";
import { updateUserSNS } from "../helpers/user-sns-update";

// ユーザーのプロフィールページに行くことができる
test("can see user profile page", async ({ page }) => {
  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
  await expect(page).toHaveTitle(
    `${decodeURIComponent(process.env.TEST_USER_NAME as string)} - NextBlogApp`,
  );
  await expect(
    page.getByRole("heading", { name: decodeURIComponent(process.env.TEST_USER_NAME as string) }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "投稿管理" })).toBeVisible();
});

test.describe("UserProfileForm", () => {
  // 初期値に表示名にログインユーザー名が入力されていて、その状態でサブミットできる
  test("can be submitted with the login user name entered as the display name by default", async ({
    page,
  }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await page.getByRole("button", { name: /プロフィールを編集/ }).click();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
    await page.getByRole("tab", { name: "基本情報" }).click();
    await expect(page.getByRole("textbox", { name: "表示名" })).toHaveValue(
      process.env.TEST_USER_NAME as string,
    );
    await page.getByRole("button", { name: "変更を保存" }).click();
    await expect(page).toHaveURL(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
  });

  // 有効な名前と自己紹介でユーザーの基本情報を更新できる
  test("can edit user basic info and see top page", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await page.getByRole("button", { name: /プロフィールを編集/ }).click();
    await page.getByRole("tab", { name: "基本情報" }).click();
    await page.getByRole("textbox", { name: "表示名" }).fill("kensuke");
    await page.getByRole("textbox", { name: "自己紹介" }).fill("Hello World");
    await page.getByRole("button", { name: "変更を保存" }).click();
    await expect(page).toHaveURL(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
  });

  // 最低文字数以下で入力した場合、バリデーションメッセージが表示される
  test("can't edit user basic info with invalid short value", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    const shortName = Array.from({ length: 2 }, () => Math.random().toString(36)[2]).join("");

    // ユーザー基本情報更新処理
    await updateUserProfile(page, shortName, "");

    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
    await expect(page.getByText("送信に失敗しました")).toBeVisible();
    await expect(page.getByText("3文字以上で入力してください")).toBeVisible();
  });

  // 最高文字数以上で入力した場合、バリデーションメッセージが表示される
  test("can't edit user basic info with invalid long value", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    const longName = Array.from({ length: 33 }, () => Math.random().toString(36)[2]).join("");
    const longBio = Array.from({ length: 201 }, () => Math.random().toString(36)[2]).join("");

    // ユーザー基本情報更新処理
    await updateUserProfile(page, longName, longBio);

    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
    await expect(page.getByText("送信に失敗しました")).toBeVisible();
    await expect(page.getByText("32文字以内で入力してください")).toBeVisible();
    await expect(page.getByText("200文字以内で入力してください").nth(0)).toBeVisible();
  });
});

test.describe("UserSNSForm", () => {
  // 有効なURLでユーザーのSNS情報を更新できる
  test("can edit user sns info and see top page", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await page.getByRole("button", { name: /プロフィールを編集/ }).click();
    await page.getByRole("tab", { name: "SNS" }).click();
    await page.getByRole("textbox", { name: /X \(Twitter\)/ }).fill("https://x.com/hoge");
    await page.getByRole("textbox", { name: /Instagram/ }).fill("https://instagram.com/hoge");
    await page.getByRole("textbox", { name: /YouTube/ }).fill("https://youtube.com/c/hoge");
    await page.getByRole("button", { name: "変更を保存" }).click();
    await expect(page).toHaveURL(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: /X \(Twitter\)/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Instagram/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /YouTube/ })).toBeVisible();
  });

  // SNSの入力値が空でも送信できる
  test("can be sent even if the input value is empty", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    // ユーザーSNS情報更新処理
    await updateUserSNS(page, "", "", "");

    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
  });

  // 無効なURL形式で入力した場合、バリデーションメッセージが表示される
  test("can't edit user sns info with invalid URL", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    // ユーザーSNS情報更新処理
    await updateUserSNS(page, "invalidURL", "invalidURL", "invalidURL");

    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
    await expect(page.getByText("送信に失敗しました")).toBeVisible();
    await expect(
      page.locator("#twitter-error").getByText("有効なURLを入力してください"),
    ).toBeVisible();
    await expect(
      page.locator("#instagram-error").getByText("有効なURLを入力してください"),
    ).toBeVisible();
    await expect(
      page.locator("#youtube-error").getByText("有効なURLを入力してください"),
    ).toBeVisible();
  });

  // 最高文字数以上で入力した場合、バリデーションメッセージが表示される
  test("can't edit user sns info with invalid long value", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    const prefix = "http://example.com";
    const length = 256 - prefix.length;
    const randomStr = Array.from({ length }, () => Math.random().toString(36)[2]).join("");
    const longURL = prefix + randomStr;

    // ユーザーSNS情報更新処理
    await updateUserSNS(page, longURL, longURL, longURL);

    expect(longURL.length).toBe(256);
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
    await expect(page.getByText("送信に失敗しました")).toBeVisible();
    await expect(
      page.locator("#twitter-error").getByText("255文字以内で入力してください"),
    ).toBeVisible();
    await expect(
      page.locator("#instagram-error").getByText("255文字以内で入力してください"),
    ).toBeVisible();
    await expect(
      page.locator("#youtube-error").getByText("255文字以内で入力してください"),
    ).toBeVisible();
  });
});

// プロフィール編集モーダルでキャンセルボタンを押すとモーダルが消える
test("pressing the cancel button in the edit profile modal causes the modal to disappear.", async ({
  page,
}) => {
  // ログイン処理
  await login(
    page,
    process.env.TEST_USER_EMAIL as string,
    process.env.TEST_USER_PASSWORD as string,
  );

  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
  await page.getByRole("button", { name: /プロフィールを編集/ }).click();
  await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
  await page.getByRole("button", { name: "キャンセル" }).click();
  await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
});

// 未ログインの場合、プロフィールを編集するボタンが表示されない
test("profile edit button not visible if not logged in", async ({ page }) => {
  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
  await expect(page.getByRole("button", { name: /プロフィールを編集/ })).not.toBeVisible();
});
