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

// FollowButtonのモック
vi.mock("../../atoms/FollowButton", () => ({
  FollowButton: ({ isFollowing }: { isFollowing: boolean }) => (
    <button data-testid="FollowButton">{isFollowing ? "フォロー中" : "フォローする"}</button>
  ),
}));

// UserProfileEditModal のモック
vi.mock("../UserProfileEditModal", () => {
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
  following: [
    {
      id: "2",
      name: "other",
      image: "/other.png",
      email: "",
      provider: "github",
      bio: "",
      posts: [],
      liked_posts: [],
      following: [],
      followers: [],
      followers_count: 0,
      following_count: 0,
      created_at: "",
      updated_at: "",
    },
  ],
  followers: [
    {
      id: "follower1",
      name: "userA",
      image: "/userA.png",
      email: "",
      provider: "github",
      bio: "",
      posts: [],
      liked_posts: [],
      following: [],
      followers: [],
      followers_count: 0,
      following_count: 0,
      created_at: "",
      updated_at: "",
      follow_id: "fid-1",
    },
  ],
  followers_count: 1,
  following_count: 1,
  created_at: "",
  updated_at: "",
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

  // 投稿数・いいね数・フォロー数・フォロワー数が表示され、リンク先が正しいことをテスト
  test("renders counts with correct links", () => {
    render(<UserProfile user={mockUser} />);
    // 投稿
    const postCountDiv = screen.getByLabelText("post-count");
    expect(postCountDiv).toHaveTextContent(String(mockUser.posts.length));
    expect(screen.getByText("投稿")).toBeInTheDocument();
    const postLink = screen.getByText("投稿").closest("a");
    expect(postLink).toHaveAttribute("href", `/${encodeURIComponent(mockUser.name)}`);

    // いいね
    const likeCountDiv = screen.getByLabelText("like-count");
    expect(likeCountDiv).toHaveTextContent(String(mockUser.liked_posts.length));
    expect(screen.getByText("いいね")).toBeInTheDocument();
    const likeLink = screen.getByText("いいね").closest("a");
    expect(likeLink).toHaveAttribute("href", `/${encodeURIComponent(mockUser.name)}/likes`);

    // フォロー
    const followingDiv = screen.getByLabelText("following-count");
    expect(followingDiv).toHaveTextContent(String(mockUser.following.length));
    expect(screen.getByText("フォロー")).toBeInTheDocument();
    const followingLink = screen.getByText("フォロー").closest("a");
    expect(followingLink).toHaveAttribute(
      "href",
      `/${encodeURIComponent(mockUser.name)}/following_users`,
    );

    // フォロワー
    const followerDiv = screen.getByLabelText("follower-count");
    expect(followerDiv).toHaveTextContent(String(mockUser.followers.length));
    expect(screen.getByText("フォロワー")).toBeInTheDocument();
    const followerLink = screen.getByText("フォロワー").closest("a");
    expect(followerLink).toHaveAttribute("href", `/${encodeURIComponent(mockUser.name)}/followers`);
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

  // ----- フォローボタン -----
  // 他ユーザーの場合はFollowButtonが表示され、isFollowing=trueで出る
  test("shows FollowButton as 'フォロー中' if current user is in followers", () => {
    useSessionMock.mockReturnValue({ data: { user: { id: "follower1" } } });
    render(<UserProfile user={mockUser} />);
    const followBtn = screen.getByTestId("FollowButton");
    expect(followBtn).toHaveTextContent("フォロー中");
  });

  // 他ユーザーで未フォローの場合
  test("shows FollowButton as 'フォローする' if current user is not following", () => {
    useSessionMock.mockReturnValue({ data: { user: { id: "not-follower" } } });
    render(<UserProfile user={mockUser} />);
    const followBtn = screen.getByTestId("FollowButton");
    expect(followBtn).toHaveTextContent("フォローする");
  });

  // 自分自身のプロフィールではFollowButtonは表示されない
  test("does not show FollowButton for self", () => {
    useSessionMock.mockReturnValue({ data: { user: { id: mockUser.id } } });
    render(<UserProfile user={mockUser} />);
    expect(screen.queryByTestId("FollowButton")).not.toBeInTheDocument();
  });

  // 未ログイン時もFollowButtonは表示されない
  test("does not show FollowButton when not logged in", () => {
    useSessionMock.mockReturnValue({ data: null });
    render(<UserProfile user={mockUser} />);
    expect(screen.queryByTestId("FollowButton")).not.toBeInTheDocument();
  });

  // ----- モーダルUI -----
  // 「プロフィールを編集」ボタンがクリックされたとき、モーダルとバックドロップが表示される
  test("shows modal and backdrop when 'プロフィールを編集' button is clicked", async () => {
    render(<UserProfile user={mockUser} />);
    const button = screen.getByRole("button", { name: "プロフィールを編集" });
    await userEvent.click(button);
    expect(screen.getByTestId("Backdrop")).toBeInTheDocument();
    expect(screen.getByTestId("UserProfileEditModal")).toBeInTheDocument();
    expect(screen.getByTestId("UserProfileEditModal")).toHaveTextContent("kensuke");
  });

  // 外側（バックドロップ）をクリックするとモーダルが閉じる
  test("closes modal when clicking outside (backdrop)", async () => {
    render(<UserProfile user={mockUser} />);
    const button = screen.getByRole("button", { name: "プロフィールを編集" });
    await userEvent.click(button);
    const backdrop = screen.getByTestId("Backdrop");
    await userEvent.click(backdrop);
    expect(screen.queryByTestId("UserProfileEditModal")).not.toBeInTheDocument();
  });
});
