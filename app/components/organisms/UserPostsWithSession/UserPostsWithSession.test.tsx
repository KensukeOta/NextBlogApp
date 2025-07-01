import type { Post } from "@/app/types/Post";
import type { User } from "@/app/types/User";
import type { Like } from "@/app/types/Like";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, test, expect, vi } from "vitest";
import { UserPostsWithSession } from "./UserPostsWithSession";

// PostItemをダミーモック
vi.mock("../Postitem", () => ({
  PostItem: ({ post }: { post: Post }) => <div data-testid="PostItem">{post.title}</div>,
}));

vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: () => ({ data: null }),
}));

const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  bio: "bio",
  posts: [],
  liked_posts: [],
};

const mockLike: Like = {
  id: "1",
  user_id: "1",
  post_id: "1",
};

// Postダミー
const mockPosts: Post[] = [
  {
    id: "1",
    title: "投稿1",
    content: "内容1",
    user_id: "1",
    user: mockUser,
    likes: [mockLike],
  },
  {
    id: "2",
    title: "投稿2",
    content: "内容2",
    user_id: "1",
    user: mockUser,
    likes: [],
  },
];

afterEach(cleanup);

describe("UserPostsWithSession", () => {
  // 投稿がある場合PostItemが正しく表示される
  test("renders PostItem for each post", () => {
    render(<UserPostsWithSession posts={mockPosts} />);
    expect(screen.getAllByTestId("PostItem")).toHaveLength(2);
    expect(screen.getByText("投稿1")).toBeInTheDocument();
    expect(screen.getByText("投稿2")).toBeInTheDocument();
    // デフォルトのnoPostMessageは表示されない
    expect(screen.queryByText("記事が投稿されていません")).not.toBeInTheDocument();
  });

  // 投稿がない場合noPostMessageが表示される
  test("renders noPostMessage when posts is empty", () => {
    render(<UserPostsWithSession posts={[]} />);
    expect(screen.getByText("記事が投稿されていません")).toBeInTheDocument();
    expect(screen.queryByTestId("PostItem")).not.toBeInTheDocument();
  });

  // noPostMessageをカスタムで渡した場合
  test("renders custom noPostMessage", () => {
    render(<UserPostsWithSession posts={[]} noPostMessage="投稿はまだありません" />);
    expect(screen.getByText("投稿はまだありません")).toBeInTheDocument();
  });
});
