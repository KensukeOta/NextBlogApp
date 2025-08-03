import type { User } from "@/app/types/User";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import * as React from "react";
import { UserEditForm } from "./UserEditForm";

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
  createUserSNSInfo: vi.fn(),
}));
// SNSフォームの見た目テスト用にmock
vi.mock("../UserSNSForm", () => ({
  UserSNSForm: () => (
    <div>
      <label aria-label="X (Twitter)">X (Twitter)</label>
      <label aria-label="Instagram">Instagram</label>
      <label aria-label="YouTube">YouTube</label>
    </div>
  ),
}));

// テストで使うモックデータ
const mockFormAction = vi.fn();
const initialState = { message: null, errors: {}, values: {} };
const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  bio: "ビオ！",
  posts: [],
  liked_posts: [],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("UserEditForm", () => {
  // 各テストのデフォルトで useActionState の戻り値を設定
  beforeEach(() => {
    vi.mocked(React.useActionState).mockReturnValue([initialState, mockFormAction, false]);
  });

  // 入力欄・ラベルが初期値で正しく表示される
  test("renders all fields with correct initial values and labels", () => {
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText("表示名")).toHaveValue("kensuke");
    expect(screen.getByPlaceholderText("表示名を入力")).toBeInTheDocument();
    expect(screen.getByLabelText("自己紹介")).toHaveValue("ビオ！");
    expect(
      screen.getByPlaceholderText("あなたのスキルや目標、好きな言語などを書いてみましょう。"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeInTheDocument();

    // aria属性の確認
    expect(screen.getByLabelText("表示名")).toHaveAttribute("aria-describedby", "name-error");
    expect(screen.getByLabelText("自己紹介")).toHaveAttribute("aria-describedby", "bio-error");
  });

  // バリデーションエラー時のメッセージ表示
  test("displays validation errors from state", () => {
    vi.mocked(React.useActionState).mockReturnValue([
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
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByText("バリデーションエラー")).toBeInTheDocument();
    expect(screen.getByText("表示名を入力してください")).toBeInTheDocument();
    expect(screen.getByText("自己紹介は200文字以内で入力してください")).toBeInTheDocument();
  });

  // state.valuesが存在する場合、その値で初期表示される
  test("prefills fields with values from state if present", () => {
    vi.mocked(React.useActionState).mockReturnValue([
      {
        message: null,
        errors: {},
        values: { name: "newname", bio: "newbio" },
      },
      mockFormAction,
      false,
    ]);
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText("表示名")).toHaveValue("newname");
    expect(screen.getByLabelText("自己紹介")).toHaveValue("newbio");
  });

  // 入力欄に値を入力できる（ユーザー操作のテスト）
  test("can type into name and bio fields", async () => {
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
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
    render(<UserEditForm user={mockUser} onCloseModal={handleClose} />);
    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(handleClose).toHaveBeenCalled();
  });

  // isPendingがtrueのとき保存ボタンがdisabledになる
  test("disables submit button when isPending is true", () => {
    vi.mocked(React.useActionState).mockReturnValue([initialState, mockFormAction, true]);
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeDisabled();
  });

  // aria属性のアクセシビリティを確認
  test("has accessible aria attributes", () => {
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByLabelText("表示名")).toHaveAttribute("aria-describedby", "name-error");
    expect(screen.getByLabelText("自己紹介")).toHaveAttribute("aria-describedby", "bio-error");
  });

  // タブリストが正しく表示される
  test("renders TabList with both tabs", () => {
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByRole("tab", { name: "基本情報" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "SNS" })).toBeInTheDocument();
  });

  // SNSタブを押すとSNSフォームが表示される
  test("shows SNS form when SNS tab is clicked", async () => {
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    // 「SNS」タブクリック
    const snsTab = screen.getByRole("tab", { name: "SNS" });
    await userEvent.click(snsTab);
    expect(screen.getByLabelText(/X \(Twitter\)/)).toBeInTheDocument();
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
    expect(screen.getByLabelText("YouTube")).toBeInTheDocument();
    // 基本情報用のinputは消える
    expect(screen.queryByLabelText("表示名")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("自己紹介")).not.toBeInTheDocument();
  });

  // SNSから基本情報タブに戻るとフォームが戻る
  test("returns to basic form when clicking basic tab again", async () => {
    render(<UserEditForm user={mockUser} onCloseModal={() => {}} />);
    // SNSタブに切り替え
    const snsTab = screen.getByRole("tab", { name: "SNS" });
    await userEvent.click(snsTab);
    // 基本情報タブに戻す
    const basicTab = screen.getByRole("tab", { name: "基本情報" });
    await userEvent.click(basicTab);
    // 再度inputが表示される
    expect(screen.getByLabelText("表示名")).toBeInTheDocument();
    expect(screen.getByLabelText("自己紹介")).toBeInTheDocument();
  });
});
