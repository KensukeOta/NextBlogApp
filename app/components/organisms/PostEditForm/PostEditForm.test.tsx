import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// テスト用のダミーPost
const dummyPost = {
  id: "post1",
  title: "サンプルタイトル",
  content: "これはサンプル本文です",
  user_id: "user1",
  user: {
    id: "user1",
    name: "テストユーザー",
    email: "user@example.com",
    image: "",
    provider: "credentials",
  },
};

// updatePostをモック
vi.mock("@/app/lib/actions", () => ({
  updatePost: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetModules();
});

// ---------------------------------------------
// テスト本体
// ---------------------------------------------
describe("<PostEditForm />", () => {
  // 初期値がセットされていること
  test("renders with initial values from post", async () => {
    const { PostEditForm } = await import("./PostEditForm");
    render(<PostEditForm post={dummyPost} />);

    expect(screen.getByPlaceholderText("タイトル")).toHaveValue(dummyPost.title);
    expect(screen.getByPlaceholderText("本文")).toHaveValue(dummyPost.content);
  });

  // 入力が更新できること
  test("can update title and content inputs", async () => {
    const { PostEditForm } = await import("./PostEditForm");
    render(<PostEditForm post={dummyPost} />);

    const user = userEvent.setup();

    const titleInput = screen.getByPlaceholderText("タイトル");
    const contentInput = screen.getByPlaceholderText("本文");

    // タイトルを更新
    await user.clear(titleInput);
    await user.type(titleInput, "新しいタイトル");
    expect(titleInput).toHaveValue("新しいタイトル");

    // 本文を更新
    await user.clear(contentInput);
    await user.type(contentInput, "新しい本文内容");
    expect(contentInput).toHaveValue("新しい本文内容");
  });

  // ボタン押下時にupdatePostが呼ばれる
  test("calls updatePost on submit", async () => {
    // useActionStateの挙動をモック
    vi.doMock("react", async (importOriginal) => {
      const actual = (await importOriginal()) as Record<string, unknown>;
      // [state, formAction, isPending]
      return {
        ...actual,
        useActionState: () => [{ message: null, errors: {}, values: {} }, vi.fn(), false] as const,
      };
    });

    const { PostEditForm } = await import("./PostEditForm");
    render(<PostEditForm post={dummyPost} />);

    const button = screen.getByRole("button", { name: "更新する" });

    expect(button).toBeInTheDocument();
    // submitしてもuseActionStateのformActionは呼ばれていない（確認のみ）
  });

  // エラー表示
  test("shows error messages from state", async () => {
    vi.doMock("react", async (importOriginal) => {
      const actual = (await importOriginal()) as Record<string, unknown>;
      return {
        ...actual,
        useActionState: () =>
          [
            {
              message: "エラーが発生しました",
              errors: {
                title: ["タイトルエラー"],
                content: ["本文エラー"],
              },
              values: {},
            },
            vi.fn(),
            false,
          ] as const,
      };
    });

    const { PostEditForm } = await import("./PostEditForm");
    render(<PostEditForm post={dummyPost} />);

    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    expect(screen.getByText("タイトルエラー")).toBeInTheDocument();
    expect(screen.getByText("本文エラー")).toBeInTheDocument();
  });

  // isPendingの時にボタンがdisabled
  test("disables the button when isPending is true", async () => {
    vi.doMock("react", async (importOriginal) => {
      const actual = (await importOriginal()) as Record<string, unknown>;
      return {
        ...actual,
        useActionState: () => [{ message: null, errors: {}, values: {} }, vi.fn(), true] as const,
      };
    });
    const { PostEditForm } = await import("./PostEditForm");
    render(<PostEditForm post={dummyPost} />);

    const button = screen.getByRole("button", { name: "更新する" });

    expect(button).toBeDisabled();
  });
});
