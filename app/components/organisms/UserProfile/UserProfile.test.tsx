/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import type { User } from "@/app/types/User";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { UserProfile } from "./UserProfile";
import userEvent from "@testing-library/user-event";

// next/image のモック
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// next/link のモック
vi.mock("next/link", () => ({
  __esModule: true,
  default: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    function MockLink(props, ref) {
      return <a ref={ref} {...props} />;
    },
  ),
}));

// Backdrop のモック
vi.mock("../../atoms/Backdrop", () => ({
  Backdrop: () => <div data-testid="Backdrop" className="backdrop-class" />,
}));

// UserProfileEditModal のモック
vi.mock("../UserProfileEditModal", () => {
  // factory内で直接forwardRefを生成
  const UserProfileEditModal = React.forwardRef<
    HTMLDivElement,
    { user: User; onCloseModal: () => void }
  >((props, ref) => (
    <div ref={ref} data-testid="UserProfileEditModal">
      {props.user.name}
    </div>
  ));
  UserProfileEditModal.displayName = "UserProfileEditModal";
  return { UserProfileEditModal };
});

// useSession のモック
const useSessionMock = vi.fn();
vi.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

// テスト用ユーザー
const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  bio: "hello",
  posts: [{ id: "p1" }] as unknown as User["posts"],
  liked_posts: [{ id: "l1" }] as unknown as User["liked_posts"],
};

beforeEach(() => {
  useSessionMock.mockReturnValue({ data: { user: { id: mockUser.id } } });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<UserProfile />", () => {
  // ユーザー画像が正しく表示されることをテスト
  test("renders user image with correct src and alt", () => {
    render(<UserProfile user={mockUser} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockUser.image);
    expect(img).toHaveAttribute("alt", "ユーザー画像");
  });

  // ユーザー名がh1見出しで表示されることをテスト
  test("renders user name in heading", () => {
    render(<UserProfile user={mockUser} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(mockUser.name);
  });

  // ユーザー画像が未指定の場合、デフォルト画像が表示されることをテスト
  test("renders default image when user.image is undefined", () => {
    const userNoImage = { ...mockUser, image: undefined as unknown as string };
    render(<UserProfile user={userNoImage} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/noavatar.png");
  });

  // ユーザーのbio（自己紹介文）が表示されることをテスト
  test("renders user bio", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
  });

  // 投稿数・いいね数が表示されることをテスト
  test("renders post count and like count", () => {
    render(<UserProfile user={mockUser} />);
    const postCountDiv = screen.getByLabelText("post-count");
    expect(postCountDiv).toHaveTextContent(String(mockUser.posts.length));
    expect(screen.getByText("投稿")).toBeInTheDocument();
    const likeCountDiv = screen.getByLabelText("like-count");
    expect(likeCountDiv).toHaveTextContent(String(mockUser.liked_posts.length));
    expect(screen.getByText("いいね")).toBeInTheDocument();
  });

  // ----- メッセージ送信ボタン -----
  // 「メッセージを送る」ボタンが自分自身の場合に表示され、hrefが正しいことをテスト
  test('renders "メッセージを送る" button and correct href for self', () => {
    render(<UserProfile user={mockUser} />);
    const btn = screen.getByRole("link", { name: /メッセージを送る/ });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", "/messages");
  });

  // 「メッセージを送る」ボタンが他ユーザーの場合に表示され、hrefが正しいことをテスト
  test('renders "メッセージを送る" button and correct href for other user', () => {
    useSessionMock.mockReturnValue({ data: { user: { id: "other-user" } } });
    render(<UserProfile user={mockUser} />);
    const btn = screen.getByRole("link", { name: /メッセージを送る/ });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", `/messages/${encodeURIComponent(mockUser.id)}`);
  });

  // 未ログイン時は「メッセージを送る」ボタンが表示されないことをテスト
  test('does not render "メッセージを送る" button when not logged in', () => {
    useSessionMock.mockReturnValue({ data: null });
    render(<UserProfile user={mockUser} />);
    expect(screen.queryByRole("link", { name: /メッセージを送る/ })).not.toBeInTheDocument();
  });

  // ----- プロフィール編集ボタン -----
  // 「プロフィールを編集」ボタンが自分自身のときだけ表示されることをテスト
  test('renders "プロフィールを編集" button only for self', () => {
    render(<UserProfile user={mockUser} />);
    const button = screen.getByRole("button", { name: "プロフィールを編集" });
    expect(button).toBeInTheDocument();
  });

  // ログインユーザーが異なる場合は「プロフィールを編集」ボタンが表示されないことをテスト
  test('does not show "プロフィールを編集" button when session user.id does not match', () => {
    useSessionMock.mockReturnValue({ data: { user: { id: "other-user-id" } } });
    render(<UserProfile user={mockUser} />);
    expect(screen.queryByRole("button", { name: "プロフィールを編集" })).not.toBeInTheDocument();
  });

  // 未ログイン時も「プロフィールを編集」ボタンが表示されないことをテスト
  test('does not show "プロフィールを編集" button when not logged in', () => {
    useSessionMock.mockReturnValue({ data: null });
    render(<UserProfile user={mockUser} />);
    expect(screen.queryByRole("button", { name: "プロフィールを編集" })).not.toBeInTheDocument();
  });

  // ----- モーダルUI -----
  // 「プロフィールを編集」ボタンをクリックするとモーダルとBackdropが表示されることをテスト
  test('shows modal and backdrop when "プロフィールを編集" button is clicked', async () => {
    render(<UserProfile user={mockUser} />);
    const button = screen.getByRole("button", { name: "プロフィールを編集" });
    await userEvent.click(button);
    expect(screen.getByTestId("Backdrop")).toBeInTheDocument();
    expect(screen.getByTestId("UserProfileEditModal")).toBeInTheDocument();
    expect(screen.getByTestId("UserProfileEditModal")).toHaveTextContent("kensuke");
  });

  // モーダル表示時にBackdrop（背景）をクリックするとモーダルが閉じることをテスト
  test("closes modal when clicking outside (backdrop)", async () => {
    render(<UserProfile user={mockUser} />);
    const button = screen.getByRole("button", { name: "プロフィールを編集" });
    await userEvent.click(button);
    const backdrop = screen.getByTestId("Backdrop");
    await userEvent.click(backdrop);
    expect(screen.queryByTestId("UserProfileEditModal")).not.toBeInTheDocument();
  });
});
