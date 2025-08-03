import type { User } from "@/app/types/User";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import * as React from "react";
import { UserDeleteButton } from "./UserDeleteButton";

// signOut, deleteUser, useActionState のモック
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));
vi.mock("@/app/lib/actions/users", () => ({
  deleteUser: vi.fn(),
}));
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  bio: "bio",
  posts: [],
  liked_posts: [],
};

afterEach(() => {
  vi.mocked(React.useActionState).mockReset();
  cleanup();
  vi.clearAllMocks();
});

// confirmモックユーティリティ
function mockConfirm(result: boolean) {
  vi.spyOn(window, "confirm").mockImplementation(() => result);
}

describe("UserDeleteButton", () => {
  // ボタンがレンダリングされる
  test("renders delete button", () => {
    // useActionStateは空で
    vi.mocked(React.useActionState).mockReturnValue([undefined, vi.fn(), false]);
    render(<UserDeleteButton user={mockUser} />);
    expect(screen.getByRole("button", { name: "ユーザーを削除" })).toBeInTheDocument();
  });

  // isPendingがtrueの時ボタンがdisabledになる
  test("button is disabled when isPending is true", () => {
    vi.mocked(React.useActionState).mockReturnValue([undefined, vi.fn(), true]);
    render(<UserDeleteButton user={mockUser} />);
    expect(screen.getByRole("button", { name: "ユーザーを削除" })).toBeDisabled();
  });

  // confirmダイアログでキャンセルした場合はAPIが呼ばれない
  test("does not call deleteUser or signOut when confirm is cancelled", async () => {
    const deleteUser = (await import("@/app/lib/actions/users")).deleteUser as ReturnType<
      typeof vi.fn
    >;
    const signOut = (await import("next-auth/react")).signOut as ReturnType<typeof vi.fn>;
    vi.mocked(React.useActionState).mockReturnValue([undefined, vi.fn(), false]);
    mockConfirm(false);

    render(<UserDeleteButton user={mockUser} />);
    await userEvent.click(screen.getByRole("button", { name: "ユーザーを削除" }));

    expect(deleteUser).not.toHaveBeenCalled();
    expect(signOut).not.toHaveBeenCalled();
  });

  // confirmでOKしたらdeleteUserが呼ばれる
  test("calls deleteUser and signOut when confirm is accepted and deleteUser returns success", async () => {
    const deleteUser = (await import("@/app/lib/actions/users")).deleteUser as ReturnType<
      typeof vi.fn
    >;
    const signOut = (await import("next-auth/react")).signOut as ReturnType<typeof vi.fn>;
    // 削除成功
    deleteUser.mockResolvedValueOnce({});

    vi.mocked(React.useActionState).mockImplementation(
      (action: (state: unknown, ...args: unknown[]) => unknown) => [undefined, action, false],
    );
    mockConfirm(true);

    render(<UserDeleteButton user={mockUser} />);
    // フォームのaction（submit）を直接実行する
    const button = screen.getByRole("button", { name: "ユーザーを削除" });
    await userEvent.click(button);
    await Promise.resolve(); // for async effect

    expect(deleteUser).toHaveBeenCalledWith(mockUser.id);
    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/login" });
  });

  // 削除失敗時はsignOutが呼ばれない
  test("does not call signOut if deleteUser returns error message", async () => {
    const deleteUser = (await import("@/app/lib/actions/users")).deleteUser as ReturnType<
      typeof vi.fn
    >;
    const signOut = (await import("next-auth/react")).signOut as ReturnType<typeof vi.fn>;
    // 削除失敗
    deleteUser.mockResolvedValueOnce({ message: "削除失敗" });

    vi.mocked(React.useActionState).mockImplementation(
      (action: (state: unknown, ...args: unknown[]) => unknown) => [undefined, action, false],
    );
    mockConfirm(true);

    render(<UserDeleteButton user={mockUser} />);
    await userEvent.click(screen.getByRole("button", { name: "ユーザーを削除" }));
    await Promise.resolve();

    expect(deleteUser).toHaveBeenCalled();
    expect(signOut).not.toHaveBeenCalled();
  });
});
