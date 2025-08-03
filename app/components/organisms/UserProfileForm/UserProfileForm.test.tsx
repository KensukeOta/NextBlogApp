import type { User } from "@/app/types/User";
import type { Mock } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import * as React from "react";
import { UserProfileForm } from "./UserProfileForm";

// UserDeleteButtonをモック化
vi.mock("../../atoms/UserDeleteButton", () => ({
  UserDeleteButton: (props: { user: User }) => (
    <div data-testid="UserDeleteButton">{props.user.name}</div>
  ),
}));

// useActionStateのグローバルモック
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

// updateUserのダミーモック
vi.mock("@/app/lib/actions/users", () => ({
  updateUser: vi.fn(),
}));

const mockFormAction = vi.fn();
const initialState = { message: null, errors: {}, values: {} };
const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  bio: "hello",
  posts: [],
  liked_posts: [],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  (React.useActionState as unknown as Mock).mockReturnValue([initialState, mockFormAction, false]);
});

describe("UserProfileForm", () => {
  // 入力欄・ラベル・初期値が正しく表示される
  test("renders all fields with correct initial values and labels", () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText("表示名")).toHaveValue("kensuke");
    expect(screen.getByPlaceholderText("表示名を入力")).toBeInTheDocument();
    expect(screen.getByLabelText("自己紹介")).toHaveValue("hello");
    expect(
      screen.getByPlaceholderText("あなたのスキルや目標、好きな言語などを書いてみましょう。"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeInTheDocument();
    // aria属性の確認
    expect(screen.getByLabelText("表示名")).toHaveAttribute("aria-describedby", "name-error");
    expect(screen.getByLabelText("自己紹介")).toHaveAttribute("aria-describedby", "bio-error");
  });

  // バリデーションエラーが表示される
  test("displays validation errors from state", () => {
    (React.useActionState as unknown as Mock).mockReturnValue([
      {
        message: "バリデーションエラー",
        errors: {
          name: ["表示名を入力してください"],
          bio: ["自己紹介は200文字以内で入力してください"],
        },
        values: {},
      },
      mockFormAction,
      false,
    ]);
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByText("バリデーションエラー")).toBeInTheDocument();
    expect(screen.getByText("表示名を入力してください")).toBeInTheDocument();
    expect(screen.getByText("自己紹介は200文字以内で入力してください")).toBeInTheDocument();
  });

  // state.valuesが存在する場合、その値で初期表示される
  test("prefills fields with values from state if present", () => {
    (React.useActionState as unknown as Mock).mockReturnValue([
      {
        message: null,
        errors: {},
        values: { name: "newname", bio: "newbio" },
      },
      mockFormAction,
      false,
    ]);
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText("表示名")).toHaveValue("newname");
    expect(screen.getByLabelText("自己紹介")).toHaveValue("newbio");
  });

  // 入力欄に値を入力できる
  test("can type into name and bio fields", async () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    const nameInput = screen.getByLabelText("表示名") as HTMLInputElement;
    const bioTextarea = screen.getByLabelText("自己紹介") as HTMLTextAreaElement;
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "newname");
    expect(nameInput).toHaveValue("newname");
    await userEvent.clear(bioTextarea);
    await userEvent.type(bioTextarea, "new bio text");
    expect(bioTextarea).toHaveValue("new bio text");
  });

  // キャンセルボタンでonCloseModalが呼ばれる
  test("calls onCloseModal when cancel button is clicked", async () => {
    const handleClose = vi.fn();
    render(<UserProfileForm user={mockUser} onCloseModal={handleClose} />);
    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(handleClose).toHaveBeenCalled();
  });

  // isPendingがtrueのとき保存ボタンがdisabledになる
  test("disables submit button when isPending is true", () => {
    (React.useActionState as unknown as Mock).mockReturnValue([initialState, mockFormAction, true]);
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeDisabled();
  });

  // UserDeleteButtonがレンダリングされている
  test("renders UserDeleteButton", () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByTestId("UserDeleteButton")).toHaveTextContent("kensuke");
  });
});
