import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OAuthMenu } from "./OAuthMenu";

// signInをモック
vi.mock("@/auth", () => ({
  signIn: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<OAuthMenu />", () => {
  // ボタンが正しく表示されること
  test("renders Google signin button", () => {
    render(<OAuthMenu />);

    const button = screen.getByRole("button", { name: "Signin with Google" });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  // ボタンを押すとsignIn("google", ...)が呼ばれること
  test("calls signIn with google provider when button is clicked", async () => {
    const user = userEvent.setup();
    const { signIn } = await import("@/auth");

    render(<OAuthMenu />);

    const button = screen.getByRole("button", { name: "Signin with Google" });

    await user.click(button);

    // サーバーアクションのため、実際の挙動はNext.js側で実装されますが、
    // モック関数として呼ばれるかは検証できる
    expect(signIn).toHaveBeenCalledWith("google", { redirectTo: "/" });
  });
});
