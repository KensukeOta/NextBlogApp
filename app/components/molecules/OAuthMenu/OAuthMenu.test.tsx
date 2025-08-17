import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OAuthMenu } from "./OAuthMenu";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
  })),
}));

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

    // 実際のサーバーアクションの挙動は Next.js が処理するので、
    // signIn がモックとして呼ばれるかどうかだけ確認
    expect(signIn).toHaveBeenCalledWith("google", { redirectTo: "/" });
  });
});
