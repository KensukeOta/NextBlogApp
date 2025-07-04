// app/components/organisms/UserSNSForm/UserSNSForm.test.tsx

import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, test, expect, vi } from "vitest";
import { UserSNSForm } from "./UserSNSForm";
import type { User } from "@/app/types/User";

// actionsのグローバルモック
vi.mock("@/app/lib/actions", () => ({
  createUserSNSInfo: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

const initialState = { message: null, errors: {}, values: {} };
const mockFormAction = vi.fn();
const baseUser: User = {
  id: "1",
  name: "testuser",
  email: "test@example.com",
  image: "",
  provider: "github",
  bio: "",
  posts: [],
  liked_posts: [],
  user_social_profiles: [
    { id: "hoge", provider: "twitter", url: "https://x.com/testuser" },
    { id: "hoge", provider: "instagram", url: "https://instagram.com/testuser" },
    { id: "hoge", provider: "youtube", url: "https://youtube.com/testuser" },
  ],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("UserSNSForm", () => {
  // 各SNSの入力欄とラベル・初期値が正しく表示されることをテスト
  test("renders each SNS input with correct label and initial value", () => {
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      initialState,
      mockFormAction,
      false,
    ]);
    render(<UserSNSForm user={baseUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText(/X \(Twitter\)/)).toHaveValue("https://x.com/testuser");
    expect(screen.getByLabelText("Instagram")).toHaveValue("https://instagram.com/testuser");
    expect(screen.getByLabelText("YouTube")).toHaveValue("https://youtube.com/testuser");
  });

  // state.valuesが使われるときの初期値
  test("shows values from state.values if present", () => {
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      {
        message: null,
        errors: {},
        values: {
          twitter: "https://x.com/override",
          instagram: "https://instagram.com/override",
          youtube: "https://youtube.com/override",
        },
      },
      mockFormAction,
      false,
    ]);
    render(<UserSNSForm user={baseUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText(/X \(Twitter\)/)).toHaveValue("https://x.com/override");
    expect(screen.getByLabelText("Instagram")).toHaveValue("https://instagram.com/override");
    expect(screen.getByLabelText("YouTube")).toHaveValue("https://youtube.com/override");
  });

  // バリデーションエラーが表示される
  test("shows validation errors if state.errors exists", () => {
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      {
        message: "Validation error",
        errors: {
          twitter: ["Invalid Twitter URL"],
          instagram: ["Invalid Instagram URL"],
          youtube: ["Invalid YouTube URL"],
        },
        values: {},
      },
      mockFormAction,
      false,
    ]);
    render(<UserSNSForm user={baseUser} onCloseModal={() => {}} />);
    expect(screen.getByText("Validation error")).toBeInTheDocument();
    expect(screen.getByText("Invalid Twitter URL")).toBeInTheDocument();
    expect(screen.getByText("Invalid Instagram URL")).toBeInTheDocument();
    expect(screen.getByText("Invalid YouTube URL")).toBeInTheDocument();
  });

  // isPendingがtrueのとき変更を保存ボタンがdisabledになる
  test("disables submit button when isPending is true", () => {
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      initialState,
      mockFormAction,
      true,
    ]);
    render(<UserSNSForm user={baseUser} onCloseModal={() => {}} />);
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeDisabled();
  });

  // キャンセルボタン押下でonCloseModalが呼ばれる
  test("calls onCloseModal when cancel button is clicked", async () => {
    const handleClose = vi.fn();
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      initialState,
      mockFormAction,
      false,
    ]);
    render(<UserSNSForm user={baseUser} onCloseModal={handleClose} />);
    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(handleClose).toHaveBeenCalled();
  });

  // SNSが未登録でも空欄で表示される
  test("shows empty value if user has no social profiles", () => {
    const userNoSNS: User = { ...baseUser, user_social_profiles: [] };
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      initialState,
      mockFormAction,
      false,
    ]);
    render(<UserSNSForm user={userNoSNS} onCloseModal={() => {}} />);
    expect(screen.getByLabelText(/X \(Twitter\)/)).toHaveValue("");
    expect(screen.getByLabelText("Instagram")).toHaveValue("");
    expect(screen.getByLabelText("YouTube")).toHaveValue("");
  });

  // 入力できること
  test("allows typing in SNS input fields", async () => {
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      initialState,
      mockFormAction,
      false,
    ]);
    render(<UserSNSForm user={baseUser} onCloseModal={() => {}} />);
    const twitterInput = screen.getByLabelText(/X \(Twitter\)/);
    await userEvent.clear(twitterInput);
    await userEvent.type(twitterInput, "https://x.com/typingtest");
    expect(twitterInput).toHaveValue("https://x.com/typingtest");
  });

  // aria属性チェック
  test("each SNS input has correct aria-describedby attribute", () => {
    (React.useActionState as unknown as { mockReturnValue: Function }).mockReturnValue([
      initialState,
      mockFormAction,
      false,
    ]);
    render(<UserSNSForm user={baseUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText(/X \(Twitter\)/)).toHaveAttribute(
      "aria-describedby",
      "twitter-error",
    );
    expect(screen.getByLabelText("Instagram")).toHaveAttribute(
      "aria-describedby",
      "instagram-error",
    );
    expect(screen.getByLabelText("YouTube")).toHaveAttribute("aria-describedby", "youtube-error");
  });
});
