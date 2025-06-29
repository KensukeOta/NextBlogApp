/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import type { User } from "@/app/types/User";
import { useSession } from "next-auth/react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { UserProfile } from "./UserProfile";
import userEvent from "@testing-library/user-event";

// next/imageのモック
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // alt属性とsrc属性、childrenをdivとして再現
    // 本番と同じような挙動になるようシンプルなimg要素に
    return <img {...props} />;
  },
}));
// Backdropのモック
vi.mock("../../atoms/Backdrop", () => ({
  Backdrop: () => <div data-testid="Backdrop" />,
}));
// UserProfileEditModalのモック
vi.mock("../UserProfileEditModal", () => ({
  UserProfileEditModal: vi
    .fn()
    .mockImplementation(({ user }: { user: User }) => (
      <div data-testid="UserProfileEditModal">{user.name}</div>
    )),
}));
// useSessionのモック
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
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

// 例: ユーザー自身としてログイン中（編集ボタンを出したい場合）
beforeEach(() => {
  // @ts-expect-error: テスト用にuseSessionの戻り値型を無視して「自分自身」としてモック
  useSession.mockReturnValue({ data: { user: { id: mockUser.id } } });
});

afterEach(() => {
  cleanup();
});

describe("UserProfile", () => {
  // ユーザー画像が表示されること
  test("renders user image with correct src and alt", () => {
    render(<UserProfile user={mockUser} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockUser.image);
    expect(img).toHaveAttribute("alt", "ユーザー画像");
  });

  // ユーザー名が表示されること
  test("renders user name in heading", () => {
    render(<UserProfile user={mockUser} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(mockUser.name);
  });

  // 画像が未指定の場合はデフォルト画像が表示されること
  test("renders default image when user.image is undefined", () => {
    const userNoImage = { ...mockUser, image: undefined as unknown as string };
    render(<UserProfile user={userNoImage} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/noavatar.png");
  });

  // bioが表示されること
  test("renders user bio", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
  });

  // 投稿数・いいね数が表示されること
  test("renders post count and like count", () => {
    render(<UserProfile user={mockUser} />);
    // 投稿数
    const postCountDiv = screen.getByLabelText("post-count");
    expect(postCountDiv).toHaveTextContent(String(mockUser.posts.length));
    expect(screen.getByText("投稿")).toBeInTheDocument();
    // いいね数
    const likeCountDiv = screen.getByLabelText("like-count");
    expect(likeCountDiv).toHaveTextContent(String(mockUser.liked_posts.length));
    expect(screen.getByText("いいね")).toBeInTheDocument();
  });

  // 「プロフィールを編集」ボタンが表示されること
  test('renders "プロフィールを編集" button', () => {
    render(<UserProfile user={mockUser} />);
    const button = screen.getByRole("button", { name: "プロフィールを編集" });
    expect(button).toBeInTheDocument();
  });

  // モーダルUIのテスト
  test('shows modal and backdrop when "プロフィールを編集" button is clicked', async () => {
    render(<UserProfile user={mockUser} />);
    const button = screen.getByRole("button", { name: "プロフィールを編集" });

    await userEvent.click(button);

    expect(screen.getByTestId("Backdrop")).toBeInTheDocument();
    expect(screen.getByTestId("UserProfileEditModal")).toBeInTheDocument();
    expect(screen.getByTestId("UserProfileEditModal")).toHaveTextContent("kensuke");
  });

  // ログインユーザーが異なる場合は「プロフィールを編集」ボタンが表示されない
  test('does not show "プロフィールを編集" button when session user.id does not match', () => {
    // @ts-expect-error: テスト用にuseSessionの戻り値型を無視してID不一致を模倣
    useSession.mockReturnValue({ data: { user: { id: "other-user-id" } } });
    render(<UserProfile user={mockUser} />);
    expect(screen.queryByRole("button", { name: "プロフィールを編集" })).not.toBeInTheDocument();
  });

  // 未ログイン時もボタンが表示されない
  test('does not show "プロフィールを編集" button when not logged in', () => {
    // @ts-expect-error: テスト用にuseSessionの戻り値型を無視して未ログイン状態を模倣
    useSession.mockReturnValue({ data: null });
    render(<UserProfile user={mockUser} />);
    expect(screen.queryByRole("button", { name: "プロフィールを編集" })).not.toBeInTheDocument();
  });
});
