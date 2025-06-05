import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "./SignupForm"; // ← require ではなく import で！

vi.mock("@/app/lib/actions", () => ({
  createUser: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetModules();
});

describe("<SignupForm />", () => {
  // フォームが正しく描画される
  test("renders all form fields", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText("名前")).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード確認")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登録" })).toBeEnabled();
  });

  // 入力値を打ち込める
  test("can fill form fields", async () => {
    render(<SignupForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("名前"), "太郎");
    await user.type(screen.getByLabelText("メールアドレス"), "taro@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.type(screen.getByLabelText("パスワード確認"), "password123");

    expect(screen.getByLabelText("名前")).toHaveValue("太郎");
    expect(screen.getByLabelText("メールアドレス")).toHaveValue("taro@example.com");
    expect(screen.getByLabelText("パスワード")).toHaveValue("password123");
    expect(screen.getByLabelText("パスワード確認")).toHaveValue("password123");
  });

  // ボタンがisPending時にdisabledになること
  test("submit button is disabled when isPending", async () => {
    // 1. useActionStateのモック
    vi.doMock("react", async () => {
      const actual = await vi.importActual<typeof import("react")>("react");
      return {
        ...actual,
        useActionState: () => [
          { message: null, errors: {}, values: {} },
          vi.fn(),
          true, // ← isPendingをtrueに
        ],
      };
    });

    // 2. 副作用が効いた状態で遅延import
    const { SignupForm } = await import("./SignupForm");
    render(<SignupForm />);

    // 3. ボタンが無効化されていること
    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled();
  });

  // エラーメッセージが表示される
  test("shows error messages from state", async () => {
    vi.resetModules();
    vi.doMock("react", async () => {
      const react = await vi.importActual<typeof import("react")>("react");
      return {
        ...react,
        useActionState: () => [
          {
            message: "登録に失敗しました",
            errors: {
              name: ["名前は必須です"],
              email: ["メールアドレスは不正です"],
              password: ["パスワードは8文字以上必要です"],
              password_confirmation: ["パスワード確認が一致しません"],
            },
            values: {},
          },
          vi.fn(),
          false,
        ],
      };
    });
    // doMockで副作用があるため遅延import
    const { SignupForm } = await import("./SignupForm");
    render(<SignupForm />);

    expect(screen.getByText("登録に失敗しました")).toBeInTheDocument();
    expect(screen.getByText("名前は必須です")).toBeInTheDocument();
    expect(screen.getByText("メールアドレスは不正です")).toBeInTheDocument();
    expect(screen.getByText("パスワードは8文字以上必要です")).toBeInTheDocument();
    expect(screen.getByText("パスワード確認が一致しません")).toBeInTheDocument();
  });
});
