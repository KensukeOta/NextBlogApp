import type { Session } from "next-auth";
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider } from "next-auth/react";
import { UserDropdownMenu } from "./UserDropdownMenu";

// LogoutButtonをモック
vi.mock("../../atoms/LogoutButton", () => ({
  LogoutButton: () => <button>ログアウト</button>,
}));

// useSessionの返り値をモック
vi.mock("next-auth/react", async (importOriginal) => {
  // originalからSessionProviderだけ持ってくる
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useSession: () => ({
      data: { user: { name: "test-user" } },
      status: "authenticated",
    }),
  };
});

const mockSession: Session = {
  user: { id: "1", name: "test-user", email: "test@example.com", image: null },
  expires: "2099-01-01T00:00:00.000Z",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// SessionProviderでラップするヘルパー
const renderWithSession = (ui: React.ReactNode) => {
  return render(<SessionProvider session={mockSession}>{ui}</SessionProvider>);
};

describe("<UserDropdownMenu />", () => {
  // メニューの描画とアクセシビリティ
  test("renders menu with proper accessibility roles and labels", () => {
    renderWithSession(<UserDropdownMenu onCloseMenu={() => {}} />);
    const menu = screen.getByRole("menu", { name: "ユーザーメニュー" });
    expect(menu).toBeInTheDocument();
  });

  // マイページ/投稿するリンクの表示
  test("renders About and 投稿する links", () => {
    renderWithSession(<UserDropdownMenu onCloseMenu={() => {}} />);
    expect(screen.getByRole("menuitem", { name: "マイページ" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "投稿する" })).toBeInTheDocument();
  });

  // onCloseMenuがクリックで呼ばれる
  test("calls onCloseMenu when a menu link is clicked", async () => {
    const user = userEvent.setup();
    const onCloseMenu = vi.fn();
    renderWithSession(<UserDropdownMenu onCloseMenu={onCloseMenu} />);
    await user.click(screen.getByRole("menuitem", { name: "マイページ" }));
    expect(onCloseMenu).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("menuitem", { name: "投稿する" }));
    expect(onCloseMenu).toHaveBeenCalledTimes(2);
  });

  // LogoutButtonが描画されていること
  test("renders LogoutButton inside menu", () => {
    renderWithSession(<UserDropdownMenu onCloseMenu={() => {}} />);
    expect(screen.getByRole("button", { name: "ログアウト" })).toBeInTheDocument();
  });
});
