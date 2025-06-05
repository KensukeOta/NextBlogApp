import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "./UserMenu";

// UserDropdownMenuも本物は不要（モックで十分）
vi.mock("../../molecules/UserDropdownMenu", () => ({
  UserDropdownMenu: ({ onCloseMenu }: { onCloseMenu: () => void }) => (
    <ul role="menu">
      <li>
        <button onClick={onCloseMenu}>閉じる</button>
      </li>
    </ul>
  ),
}));

// next-auth/reactのuseSessionもモック
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        name: "テストユーザー",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
    },
  }),
}));

// next/imageは通常imgタグになる（jest/vitest環境では）
vi.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-explicit-any
  default: (props: any) => <img alt="" {...props} />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetModules();
});

describe("<UserMenu />", () => {
  // アバターボタンが描画されることをテスト
  test("renders user avatar button", () => {
    render(<UserMenu />);

    const button = screen.getByRole("button", { name: "ユーザーメニューを開く" });

    expect(button).toBeInTheDocument();

    // 画像が表示されている
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.src).toBe("https://example.com/avatar.png");
  });

  // アバタークリックでメニューが開くことをテスト
  test("opens dropdown menu on button click", async () => {
    render(<UserMenu />);

    const button = screen.getByRole("button", { name: "ユーザーメニューを開く" });
    await userEvent.click(button);

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("閉じる")).toBeInTheDocument();
  });

  // UserDropdownMenuのonCloseMenu呼び出しでメニューが閉じることをテスト
  test("closes menu when onCloseMenu is called", async () => {
    render(<UserMenu />);
    const button = screen.getByRole("button", { name: "ユーザーメニューを開く" });
    await userEvent.click(button);

    // 開いてる状態
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // 閉じるボタン押すと閉じる
    await userEvent.click(screen.getByText("閉じる"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // メニュー表示中に外側をクリックしたときメニューが閉じることをテスト
  test("closes menu when clicking outside", async () => {
    render(<UserMenu />);

    const button = screen.getByRole("button", { name: "ユーザーメニューを開く" });
    await userEvent.click(button);

    // 開いてる状態
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // 外側クリック（document.body）
    await userEvent.click(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
