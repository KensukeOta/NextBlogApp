import type { Mock } from "vitest";
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoutButton } from "./LogoutButton";

// signOutをモック
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

// クリーンアップ
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<LogoutButton />", () => {
  // ログアウトボタンが描画されていることをテスト
  test("renders logout button", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "ログアウト" });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  // ボタンをクリックするとsignOutが呼ばれることをテスト
  test("calls signOut when clicked", async () => {
    const user = userEvent.setup();
    const { signOut } = await import("next-auth/react");

    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "ログアウト" });

    await user.click(button);

    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/login" });
  });

  // ボタン押下後はdisabledになることをテスト
  test("button becomes disabled after clicking", async () => {
    // signOutをPromiseで遅延させる
    const { signOut } = await import("next-auth/react");
    let resolveSignOut: () => void;

    (signOut as Mock).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSignOut = resolve;
        }),
    );

    const user = userEvent.setup();

    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "ログアウト" });

    // クリックする
    await user.click(button);

    // クリック直後にdisabledになっていることを検証
    expect(button).toBeDisabled();

    // モックしたsignOutを完了させる
    resolveSignOut!();
  });
});
