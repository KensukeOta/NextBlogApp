import type { Mock } from "vitest";
import type { Post } from "@/app/types/Post";
import type { User } from "@/app/types/User";
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostDeleteButton } from "./PostDeleteButton";

// テスト用のダミーUser
const dummyUser: User = {
  id: "user1",
  name: "dummy user",
  email: "dummy@example.com",
  image: "",
  provider: "credentials",
};

// テスト用のダミーPost
function makeDummyPost(id: string): Post {
  return {
    id,
    title: "dummy title",
    content: "dummy content",
    user_id: dummyUser.id,
    user: dummyUser,
  };
}

// deletePostをモック
vi.mock("@/app/lib/actions", () => ({
  deletePost: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<PostDeleteButton />", () => {
  // 削除ボタンが描画されていることをテスト
  // Test that the delete button is rendered and enabled initially
  test("renders delete button and it is enabled", () => {
    render(<PostDeleteButton post={makeDummyPost("1")} />);

    const button = screen.getByRole("button", { name: "削除" });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  // confirmがtrueのときdeletePostが呼ばれること
  // Test that deletePost is called when confirmed
  test("calls deletePost when confirm returns true", async () => {
    const user = userEvent.setup();
    // confirmをtrueにモック
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    const { deletePost } = await import("@/app/lib/actions");

    render(<PostDeleteButton post={makeDummyPost("123")} />);

    const button = screen.getByRole("button", { name: "削除" });
    await user.click(button);

    // deletePostが呼ばれる
    await waitFor(() => {
      expect(deletePost).toHaveBeenCalledWith("123");
    });
  });

  // confirmがfalseのときdeletePostが呼ばれないこと
  // Test that deletePost is NOT called when confirm returns false
  test("does not call deletePost when confirm returns false", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    const { deletePost } = await import("@/app/lib/actions");

    render(<PostDeleteButton post={makeDummyPost("999")} />);

    const button = screen.getByRole("button", { name: "削除" });
    await user.click(button);

    // deletePostが呼ばれない
    expect(deletePost).not.toHaveBeenCalled();
  });

  // isPending中はボタンがdisabledになること
  // Test that the button is disabled during pending state
  test("disables the button while pending", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    // deletePostをPromiseで遅延
    let resolveDelete: () => void;
    const { deletePost } = await import("@/app/lib/actions");
    (deletePost as Mock).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        }),
    );

    render(<PostDeleteButton post={makeDummyPost("1")} />);

    const button = screen.getByRole("button", { name: "削除" });

    // クリック
    await user.click(button);

    // isPendingでdisabledになる
    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    // Promiseをresolveして完了
    resolveDelete!();
  });
});
