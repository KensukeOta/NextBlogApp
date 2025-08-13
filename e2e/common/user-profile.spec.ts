import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
import { updateUserProfile } from "../helpers/user-profile-update";
import { updateUserSNS } from "../helpers/user-sns-update";

// ユーザーのプロフィールページに行くことができる
test("should be able to visit the user's profile page", async ({ page }) => {
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
  test("should have the logged-in user's name as the initial value for the display name and allow submitting without changes", async ({
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
    await expect(page.getByText(/プロフィールを更新しました/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
  });

  // 有効な名前と自己紹介でユーザーの基本情報を更新できる
  test("should be able to update the user's basic information with a valid name and bio", async ({
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
    await page.getByRole("tab", { name: "基本情報" }).click();
    await page.getByRole("textbox", { name: "表示名" }).fill("kensuke");
    await page.getByRole("textbox", { name: "自己紹介" }).fill("Hello World");
    await page.getByRole("button", { name: "変更を保存" }).click();
    await expect(page).toHaveURL(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await expect(page.getByText(/プロフィールを更新しました/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
  });

  // 最低文字数以下で入力した場合、バリデーションメッセージが表示される
  test("should display a validation message when input is below the minimum character limit", async ({
    page,
  }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    const shortName = Array.from({ length: 2 }, () => Math.random().toString(36)[2]).join("");

    // ユーザー基本情報更新処理
    await updateUserProfile(page, shortName, "");

    await expect(page.getByText(/プロフィールを更新しました/)).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
    await expect(page.getByText("送信に失敗しました")).toBeVisible();
    await expect(page.getByText("3文字以上で入力してください")).toBeVisible();
  });

  // 最高文字数以上で入力した場合、バリデーションメッセージが表示される
  test("should display a validation message when input is below the maximum character limit", async ({
    page,
  }) => {
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

    await expect(page.getByText(/プロフィールを更新しました/)).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();
    await expect(page.getByText("送信に失敗しました")).toBeVisible();
    await expect(page.getByText("32文字以内で入力してください")).toBeVisible();
    await expect(page.getByText("200文字以内で入力してください").nth(0)).toBeVisible();
  });
});

test.describe("UserSNSForm", () => {
  // 有効なURLでユーザーのSNS情報を更新できる
  test("should be able to update the user's SNS information with a valid URL", async ({ page }) => {
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
    await expect(page.getByText(/プロフィールを更新しました/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: /X \(Twitter\)/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Instagram/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /YouTube/ })).toBeVisible();
  });

  // SNSの入力値が空でも送信できる
  test("should allow submitting the form even when the SNS field is empty", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    // ユーザーSNS情報更新処理
    await updateUserSNS(page, "", "", "");

    await expect(page.getByText(/プロフィールを更新しました/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
  });

  // 無効なURL形式で入力した場合、バリデーションメッセージが表示される
  test("should display a validation message when an invalid URL format is entered", async ({
    page,
  }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    // ユーザーSNS情報更新処理
    await updateUserSNS(page, "invalidURL", "invalidURL", "invalidURL");

    await expect(page.getByText(/プロフィールを更新しました/)).not.toBeVisible();
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
  test("should display a validation message when input is below the maximum character limit", async ({
    page,
  }) => {
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
    await expect(page.getByText(/プロフィールを更新しました/)).not.toBeVisible();
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

test.describe("UserInfoForm", () => {
  // 有効なタグでユーザー情報を更新できる
  test("should be able to update the user's information with valid tags", async ({ page }) => {
    // ログイン処理
    await login(
      page,
      process.env.TEST_USER_EMAIL as string,
      process.env.TEST_USER_PASSWORD as string,
    );

    const tagName = Array.from({ length: 5 }, () => Math.random().toString(36)[2]).join("");

    await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await page.getByRole("button", { name: /プロフィールを編集/ }).click();
    await page.getByRole("tab", { name: "ユーザー情報" }).click();
    await page.getByRole("textbox", { name: "タグ" }).fill(tagName);
    await page.getByRole("textbox", { name: "タグ" }).press("Enter");
    await page.getByRole("button", { name: "変更を保存" }).click();
    await expect(page).toHaveURL(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
    await expect(page.getByText(/プロフィールを更新しました/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: tagName })).toBeVisible();
  });
});

// プロフィール編集モーダルでキャンセルボタンを押すとモーダルが消える
test("should close the profile edit modal when the Cancel button is clicked", async ({ page }) => {
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
test("should not display the edit profile button when not logged in", async ({ page }) => {
  await page.goto(`/${encodeURIComponent(process.env.TEST_USER_NAME as string)}`);
  await expect(page.getByRole("button", { name: /プロフィールを編集/ })).not.toBeVisible();
});
