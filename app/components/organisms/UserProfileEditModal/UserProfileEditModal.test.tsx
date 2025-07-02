import type { User } from "@/app/types/User";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { UserProfileEditModal } from "./UserProfileEditModal";

// UserEditFormをモック
vi.mock("../UserEditForm", () => ({
  UserEditForm: (props: { user: User }) => <div data-testid="UserEditForm">{props.user.name}</div>,
}));

// UserDeleteButtonをモック
vi.mock("../../atoms/UserDeleteButton", () => ({
  UserDeleteButton: (props: { user: User }) => (
    <div data-testid="UserDeleteButton">{props.user.name} 削除</div>
  ),
}));

const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  bio: "hello",
  posts: [],
  liked_posts: [],
};

afterEach(() => {
  cleanup();
});

describe("UserProfileEditModal", () => {
  // モーダル（dialog role）が表示されること
  test("renders dialog with correct title and description", () => {
    render(<UserProfileEditModal user={mockUser} onCloseModal={vi.fn()} />);
    // ダイアログ要素
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // タイトルと説明
    expect(screen.getByText("プロフィール編集")).toBeInTheDocument();
    expect(
      screen.getByText("プロフィール情報を編集して、自分をアピールしましょう。"),
    ).toBeInTheDocument();
  });

  // UserEditFormが呼ばれ、user名が表示されること
  test("renders UserEditForm with user prop", () => {
    render(<UserProfileEditModal user={mockUser} onCloseModal={vi.fn()} />);
    expect(screen.getByTestId("UserEditForm")).toHaveTextContent("kensuke");
  });

  // 閉じるボタンを押すとonCloseModalが呼ばれること
  test("calls onCloseModal when close button is clicked", async () => {
    const handleClose = vi.fn();
    render(<UserProfileEditModal user={mockUser} onCloseModal={handleClose} />);
    const closeButton = screen.getByRole("button");
    await userEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
