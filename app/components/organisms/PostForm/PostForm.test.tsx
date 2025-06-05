import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// createPostアクションをモック
vi.mock("@/app/lib/actions", () => ({
  createPost: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetModules();
});

describe("<PostForm />", () => {
  // 基本の描画テスト
  test("renders title and content inputs and submit button", async () => {
    const { PostForm } = await import("./PostForm");
    render(<PostForm />);

    expect(screen.getByPlaceholderText("タイトル")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("本文")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "投稿する" })).toBeInTheDocument();
  });

  // 入力値反映テスト
  test("updates input values on change", async () => {
    const { PostForm } = await import("./PostForm");
    render(<PostForm />);

    const user = userEvent.setup();
    const titleInput = screen.getByPlaceholderText("タイトル") as HTMLInputElement;
    const contentInput = screen.getByPlaceholderText("本文") as HTMLTextAreaElement;

    await user.type(titleInput, "テストタイトル");
    expect(titleInput.value).toBe("テストタイトル");

    await user.type(contentInput, "テスト本文");
    expect(contentInput.value).toBe("テスト本文");
  });

  // バリデーションエラー表示
  test("shows error messages from state", async () => {
    // ここで react の useActionState だけを差し替える
    vi.doMock("react", async (importOriginal) => {
      const actual = (await importOriginal()) as Record<string, unknown>;
      return {
        ...actual,
        useActionState: () =>
          [
            {
              message: "エラーが発生しました",
              errors: {
                title: ["タイトルは必須です"],
                content: ["本文は必須です"],
              },
              values: {},
            },
            () => {},
            false,
          ] as [unknown, () => void, boolean],
      };
    });

    // ここで「毎回」importし直すことでモックが効いた状態にする！
    const { PostForm } = await import("./PostForm");

    render(<PostForm />);

    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    expect(screen.getByText("タイトルは必須です")).toBeInTheDocument();
    expect(screen.getByText("本文は必須です")).toBeInTheDocument();
  });
});
