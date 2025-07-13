import { describe, test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { User } from "@/app/types/User";
import React from "react";

// displayNameありのMockLinkを定義
const MockLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  (props, ref) => <a ref={ref} {...props} />,
);
MockLink.displayName = "MockLink";

// 必ずimport前にモック
vi.mock("next/link", () => ({
  __esModule: true,
  default: MockLink,
}));

// テスト用ダミーユーザー
const mockUser: User = {
  id: "u1",
  name: "ユーザー名",
  email: "user@example.com",
  image: "",
  provider: "github",
  bio: "",
  posts: [],
  liked_posts: [],
  tags: [
    { id: "hoge", name: "React" },
    { id: "fuga", name: "NextJS" },
  ],
};

afterEach(() => {
  cleanup();
});

describe("<UserInfoProfile />", () => {
  // ユーザー情報セクションとタグリンクが正しく表示されるかをテスト
  test("renders user info section and tag links correctly", async () => {
    // ユーザー情報とタグリンクの表示を確認
    // SUTをテスト内importで取得
    const { UserInfoProfile } = await import("./UserInfoProfile");
    render(<UserInfoProfile user={mockUser} />);
    expect(screen.getByText("ユーザー情報")).toBeInTheDocument();
    expect(screen.getByText("タグ")).toBeInTheDocument();

    // タグ名表示とリンク先を確認
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("NextJS")).toBeInTheDocument();
    const reactLink = screen.getByRole("link", { name: "React" });
    expect(reactLink).toHaveAttribute("href", "/tags/React");
    const nextjsLink = screen.getByRole("link", { name: "NextJS" });
    expect(nextjsLink).toHaveAttribute("href", "/tags/NextJS");
  });

  // タグが空のときリストが存在しliが0件であることをテスト
  test("renders empty tag list when user.tags is empty", async () => {
    // タグが空配列時、ulは存在しliはないこと
    const { UserInfoProfile } = await import("./UserInfoProfile");
    render(<UserInfoProfile user={{ ...mockUser, tags: [] }} />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll("li").length).toBe(0);
  });
});
