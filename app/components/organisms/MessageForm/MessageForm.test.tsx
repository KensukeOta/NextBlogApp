import { describe, test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import type { MessageState } from "@/app/lib/actions/messages";

// ----- モック用のグローバル変数 -----
let mockState: MessageState = { message: null, errors: {}, values: {} };
let mockIsPending: boolean = false;

// reactのuseActionStateをグローバルモック
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof React>();
  return {
    ...actual,
    useActionState: () => [mockState, vi.fn(), mockIsPending] as const,
  };
});

// createMessageもモック
vi.mock("@/app/lib/actions/messages", () => ({
  createMessage: vi.fn(),
}));

afterEach(() => {
  cleanup();
  mockState = { message: null, errors: {}, values: {} };
  mockIsPending = false;
});

// ---------------------------------------------
// テスト本体
// ---------------------------------------------
describe("<MessageForm />", () => {
  // 入力欄と送信ボタンがあること
  test("renders input and submit button", async () => {
    const { MessageForm } = await import("./MessageForm");
    render(<MessageForm userId="user-1" />);
    expect(screen.getByPlaceholderText("メッセージを入力...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // state.messageが表示されること
  test("shows error message from state.message", async () => {
    mockState = { message: "送信エラー", errors: {}, values: {} };
    const { MessageForm } = await import("./MessageForm");
    render(<MessageForm userId="user-1" />);
    expect(screen.getByText("送信エラー")).toBeInTheDocument();
  });

  // state.errors.contentが配列で表示されること
  test("shows validation errors for content", async () => {
    mockState = {
      message: null,
      errors: { content: ["必須項目です", "10文字以上入力してください"] },
      values: {},
    };
    const { MessageForm } = await import("./MessageForm");
    render(<MessageForm userId="user-1" />);
    expect(screen.getByText("必須項目です")).toBeInTheDocument();
    expect(screen.getByText("10文字以上入力してください")).toBeInTheDocument();
  });

  // isPendingがtrueだとボタンがdisabledになる
  test("disables submit button when isPending is true", async () => {
    mockState = { message: null, errors: {}, values: {} };
    mockIsPending = true;
    const { MessageForm } = await import("./MessageForm");
    render(<MessageForm userId="user-1" />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // state.values.contentがinputに反映される
  test("reflects state.values.content in input", async () => {
    mockState = { message: null, errors: {}, values: { content: "前回送信した内容" } };
    const { MessageForm } = await import("./MessageForm");
    render(<MessageForm userId="user-1" />);
    expect(screen.getByDisplayValue("前回送信した内容")).toBeInTheDocument();
  });
});
