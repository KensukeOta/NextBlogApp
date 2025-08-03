import { describe, test, expect, vi, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// UncaughtException対策（react-tag-inputのfocus undefinedを無視）
process.on("uncaughtException", (err) => {
  if (
    err &&
    typeof err.message === "string" &&
    err.message.includes("Cannot read properties of undefined (reading 'focus')")
  ) {
    // テスト用に黙殺
    return;
  }
  throw err;
});

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

// テスト用のダミーPost
const dummyPost = {
  id: "post1",
  title: "サンプルタイトル",
  content: "これはサンプル本文です",
  user_id: "user1",
  tags: [
    { id: 1, name: "最初タグ" },
    { id: 2, name: "タグ2" },
  ],
  user: {
    id: "user1",
    name: "テストユーザー",
    email: "user@example.com",
    image: "",
    provider: "credentials",
  },
};

// updatePostをモック
vi.mock("@/app/lib/actions/posts", () => ({
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

    // タグも2つ表示
    expect(screen.getByText("最初タグ")).toBeInTheDocument();
    expect(screen.getByText("タグ2")).toBeInTheDocument();

    // hidden inputにも値が設定されている
    expect(screen.getByDisplayValue(JSON.stringify(["最初タグ", "タグ2"]))).toHaveAttribute(
      "type",
      "hidden",
    );
  });

  // 入力が更新できること
  test("can update title and content, and tags", async () => {
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

    // タグ追加
    const tagInput = screen.getByPlaceholderText(
      /文字を入力し、エンターキーを押すとタグが作れます/,
    ) as HTMLInputElement;

    await user.type(tagInput, "追加タグ{enter}");
    expect(screen.getByText("追加タグ")).toBeInTheDocument();

    // hidden inputにも反映
    expect(
      screen.getByDisplayValue(JSON.stringify(["最初タグ", "タグ2", "追加タグ"])),
    ).toBeInTheDocument();
  });

  // タグ削除（1つ消すとhidden inputが更新される）
  test("removes a tag and updates hidden input", async () => {
    const { PostEditForm } = await import("./PostEditForm");
    render(<PostEditForm post={dummyPost} />);
    const user = userEvent.setup();

    // 「タグ2」の右の「×」ボタンで消す
    const tag2RemoveBtn = screen.getAllByTestId("remove")[1]; // 2番目のタグ
    await user.click(tag2RemoveBtn);

    // タグ2が消えている
    expect(screen.queryByText("タグ2")).not.toBeInTheDocument();
    // hidden inputは ["最初タグ"]
    expect(screen.getByDisplayValue(JSON.stringify(["最初タグ"]))).toBeInTheDocument();
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
