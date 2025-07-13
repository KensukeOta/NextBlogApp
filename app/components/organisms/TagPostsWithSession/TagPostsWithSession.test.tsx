import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { Post } from "@/app/types/Post";
import React from "react";

// PostItemをモック（内容はどうでもよいのでダミー出力）
vi.mock("../Postitem", () => ({
  PostItem: ({ post }: { post: Post }) => <div data-testid="mock-postitem">{post.title}</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const dummyPosts: Post[] = [
  {
    id: "p1",
    title: "記事1",
    content: "内容1",
    user_id: "u1",
    user: {
      id: "u1",
      name: "ユーザーA",
      email: "a@example.com",
      image: "",
      provider: "github",
    },
    tags: [],
    liked_users: [],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p2",
    title: "記事2",
    content: "内容2",
    user_id: "u2",
    user: {
      id: "u2",
      name: "ユーザーB",
      email: "b@example.com",
      image: "",
      provider: "google",
    },
    tags: [],
    liked_users: [],
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

describe("<TagPostsWithSession />", () => {
  // 記事がある場合、PostItemが各記事分描画されることをテスト
  test("renders PostItem for each post when posts exist", async () => {
    // モックのPostItemが各記事タイトルで描画されること
    const { TagPostsWithSession } = await import("./TagPostsWithSession");
    render(<TagPostsWithSession posts={dummyPosts} />);
    expect(screen.getByText("記事1")).toBeInTheDocument();
    expect(screen.getByText("記事2")).toBeInTheDocument();
    // PostItemの個数
    expect(screen.getAllByTestId("mock-postitem")).toHaveLength(2);
  });

  // 記事が0件ならデフォルトのメッセージが表示されることをテスト
  test("shows noPostMessage when posts is empty", async () => {
    const { TagPostsWithSession } = await import("./TagPostsWithSession");
    render(<TagPostsWithSession posts={[]} />);
    expect(screen.getByText("記事が投稿されていません")).toBeInTheDocument();
  });

  // noPostMessageプロップでカスタムメッセージが表示されることをテスト
  test("shows custom noPostMessage if provided", async () => {
    const { TagPostsWithSession } = await import("./TagPostsWithSession");
    render(<TagPostsWithSession posts={[]} noPostMessage="No articles found" />);
    expect(screen.getByText("No articles found")).toBeInTheDocument();
  });
});
