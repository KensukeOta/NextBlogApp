import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserDropdownMenu } from "./UserDropdownMenu";

// LogoutButtonをモック
vi.mock("../../atoms/LogoutButton", () => ({
  LogoutButton: () => <button>ログアウト</button>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<UserDropdownMenu />", () => {
  // メニューの描画とアクセシビリティ
  test("renders menu with proper accessibility roles and labels", () => {
    render(<UserDropdownMenu onCloseMenu={() => {}} />);

    const menu = screen.getByRole("menu", { name: "ユーザーメニュー" });

    expect(menu).toBeInTheDocument();
  });

  // About/投稿するリンクの表示
  test("renders About and 投稿する links", () => {
    render(<UserDropdownMenu onCloseMenu={() => {}} />);

    expect(screen.getByRole("menuitem", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "投稿する" })).toBeInTheDocument();
  });

  // onCloseMenuがクリックで呼ばれる
  test("calls onCloseMenu when a menu link is clicked", async () => {
    const user = userEvent.setup();
    const onCloseMenu = vi.fn();

    render(<UserDropdownMenu onCloseMenu={onCloseMenu} />);

    await user.click(screen.getByRole("menuitem", { name: "About" }));
    expect(onCloseMenu).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("menuitem", { name: "投稿する" }));
    expect(onCloseMenu).toHaveBeenCalledTimes(2);
  });

  // LogoutButtonが描画されていること
  test("renders LogoutButton inside menu", () => {
    render(<UserDropdownMenu onCloseMenu={() => {}} />);

    expect(screen.getByRole("button", { name: "ログアウト" })).toBeInTheDocument();
  });
});
