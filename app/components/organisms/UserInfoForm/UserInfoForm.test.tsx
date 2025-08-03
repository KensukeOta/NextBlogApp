import type { User } from "@/app/types/User";
import type { ReactTagInput } from "@/app/types/ReactTagInput";
import { describe, test, expect, afterEach, vi, beforeAll, afterAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// react-tag-inputのモック（型付け）
vi.mock("react-tag-input", () => {
  type ReactTagsProps = {
    tags: ReactTagInput[];
    handleAddition: (tag: ReactTagInput) => void;
    handleDelete: (index: number) => void;
    placeholder?: string;
    onClearAll?: () => void;
    [key: string]: unknown;
  };
  return {
    WithContext: ({
      tags,
      handleAddition,
      handleDelete,
      placeholder,
      onClearAll,
    }: ReactTagsProps) => (
      <div>
        {/* タグの見た目 */}
        {tags.map((tag, i) => (
          <span key={tag.id}>
            {tag.text}
            <button data-testid="remove" onClick={() => handleDelete(i)}>
              ×
            </button>
          </span>
        ))}
        {/* タグ追加用のinput */}
        <input
          data-testid="tag-input"
          placeholder={placeholder}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && (e.currentTarget as HTMLInputElement).value) {
              handleAddition({
                id: String(Date.now()),
                text: (e.currentTarget as HTMLInputElement).value,
                className: "",
              });
              (e.currentTarget as HTMLInputElement).value = "";
              e.preventDefault();
            }
          }}
        />
        {/* 全消しボタン */}
        <button type="button" data-testid="clear-all" onClick={onClearAll}>
          Clear all
        </button>
      </div>
    ),
  };
});

// react-tag-inputのfocusエラーを潰す
const originalError = console.error;
beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Cannot read properties of undefined (reading 'focus')")
    ) {
      return;
    }
    originalError(...args);
  });
});
afterAll(() => {
  console.error = originalError;
});

// updateUserをモック
vi.mock("@/app/lib/actions/users", () => ({
  updateUser: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetModules();
});

// テスト用ユーザー
const mockUser: User = {
  id: "u1",
  name: "テストユーザー",
  email: "user@example.com",
  image: "",
  provider: "github",
  bio: "",
  posts: [],
  liked_posts: [],
  tags: [
    { id: 1, name: "Python" },
    { id: 2, name: "React" },
  ],
};

describe("<UserInfoForm />", () => {
  // タグの初期値表示・hidden input反映をテスト
  test("shows initial tags and updates hidden input", async () => {
    // タグ欄に初期タグが表示され、hidden inputにも反映されること
    const { UserInfoForm } = await import("./UserInfoForm");
    render(<UserInfoForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();

    // hidden inputに正しい値
    const hiddenTagsInput = screen.getByDisplayValue(JSON.stringify(["Python", "React"]));
    expect(hiddenTagsInput).toBeInTheDocument();
    expect(hiddenTagsInput).toHaveAttribute("type", "hidden");
  });

  // タグ追加できることをテスト
  test("can add a tag and update hidden input", async () => {
    // タグ追加ができ、hidden inputにも値が反映されること
    const { UserInfoForm } = await import("./UserInfoForm");
    render(<UserInfoForm user={mockUser} onCloseModal={() => {}} />);
    const user = userEvent.setup();

    // タグ追加
    const tagInput = screen.getByPlaceholderText(
      /文字を入力し、エンターキーを押すとタグが作れます/,
    ) as HTMLInputElement;
    await user.type(tagInput, "新タグ{enter}");

    expect(screen.getByText("新タグ")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(JSON.stringify(["Python", "React", "新タグ"])),
    ).toBeInTheDocument();
  });

  // タグを1つ消したときhidden inputも更新される
  test("removes a tag and updates hidden input", async () => {
    // タグを削除したときhidden inputも更新されること
    const { UserInfoForm } = await import("./UserInfoForm");
    render(<UserInfoForm user={mockUser} onCloseModal={() => {}} />);
    const user = userEvent.setup();

    // 2番目のタグ（React）の削除ボタン
    const removeBtns = screen.getAllByTestId("remove");
    await user.click(removeBtns[1]);
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue(JSON.stringify(["Python"]))).toBeInTheDocument();
  });

  // タグが空のときhidden inputも空配列になる
  test("clears all tags and updates hidden input", async () => {
    // すべてのタグを消した場合hidden inputが[]になる
    const { UserInfoForm } = await import("./UserInfoForm");
    render(<UserInfoForm user={mockUser} onCloseModal={() => {}} />);
    const user = userEvent.setup();

    // "Clear all"ボタン
    const clearBtn = screen.getByRole("button", { name: /clear all/i });
    await user.click(clearBtn);

    expect(screen.queryByText("Python")).not.toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue(JSON.stringify([]))).toBeInTheDocument();
  });

  // 「キャンセル」ボタン押下でonCloseModalが呼ばれる
  test("calls onCloseModal when cancel button is clicked", async () => {
    // キャンセルボタンでonCloseModalが呼ばれること
    const onCloseModal = vi.fn();
    const { UserInfoForm } = await import("./UserInfoForm");
    render(<UserInfoForm user={mockUser} onCloseModal={onCloseModal} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(onCloseModal).toHaveBeenCalled();
  });

  // isPending時にsubmitボタンがdisabledになる
  test("disables submit button when isPending is true", async () => {
    // isPendingがtrueの時にsubmitボタンがdisabledになること
    vi.doMock("react", async (importOriginal) => {
      const actual = (await importOriginal()) as typeof import("react");
      return {
        ...actual,
        useActionState: () => [{ message: null, errors: {}, values: {} }, vi.fn(), true] as const,
      };
    });
    const { UserInfoForm } = await import("./UserInfoForm");
    render(<UserInfoForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeDisabled();
  });

  // バリデーションエラーが表示される
  test("shows error message from state", async () => {
    // バリデーションエラー表示の確認
    vi.doMock("react", async (importOriginal) => {
      const actual = (await importOriginal()) as typeof import("react");
      return {
        ...actual,
        useActionState: () =>
          [
            {
              message: "タグを入力してください",
              errors: {},
              values: {},
            },
            vi.fn(),
            false,
          ] as const,
      };
    });
    const { UserInfoForm } = await import("./UserInfoForm");
    render(<UserInfoForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByText("タグを入力してください")).toBeInTheDocument();
  });
});
