// UserItemコンポーネントのテスト

import { describe, expect, vi, afterEach, test } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { UserItem } from "./UserItem";

// FollowButtonのモック（実際の描画は省略）
vi.mock("../../atoms/FollowButton", () => ({
  FollowButton: () => <button>MockFollowButton</button>,
}));

afterEach(cleanup);

// サンプルユーザー
const followUser = {
  id: "user1",
  name: "user1",
  image: "/user1.png",
  follow_id: "follow-abc",
};
const currentUser = {
  id: "user2",
  name: "user2",
  email: "user2@example.com",
  image: "/user2.png",
  provider: "credentials",
  bio: "",
  posts: [],
  liked_posts: [],
  user_social_profiles: [],
  tags: [],
  following: [],
  followers: [],
};

describe("UserItem", () => {
  // ユーザー名と画像が正しく表示されていること
  test("renders user name and image with link", () => {
    render(
      <UserItem
        followUser={followUser}
        currentUser={currentUser}
        isFollowing={false}
        followId={followUser.follow_id}
      />,
    );
    // 名前がリンクで表示されている
    const nameLink = screen.getAllByRole("link", { name: "user1" })[0];
    expect(nameLink).toHaveAttribute("href", "/user1");
    // 画像がリンク内で表示されている
    const img = screen.getByAltText("ユーザー画像");
    expect(img).toHaveAttribute("src", expect.stringContaining("user1.png"));
    expect(img).toHaveAttribute("width", "48");
    expect(img).toHaveAttribute("height", "48");
  });

  // currentUserがnullの場合はFollowButtonが表示されないこと
  test("does not render FollowButton when currentUser is null", () => {
    render(
      <UserItem
        followUser={followUser}
        currentUser={null}
        isFollowing={false}
        followId={followUser.follow_id}
      />,
    );
    // FollowButtonがない（モックのテキストがない）
    expect(screen.queryByText("MockFollowButton")).not.toBeInTheDocument();
  });

  // currentUserとfollowUserのidが同じ場合はFollowButtonが表示されないこと
  test("does not render FollowButton when currentUser.id === followUser.id", () => {
    render(
      <UserItem
        followUser={followUser}
        currentUser={{ ...currentUser, id: followUser.id }}
        isFollowing={false}
        followId={followUser.follow_id}
      />,
    );
    expect(screen.queryByText("MockFollowButton")).not.toBeInTheDocument();
  });

  // currentUserが存在し、idが異なる場合はFollowButtonが表示されること
  test("renders FollowButton when currentUser exists and id is different", () => {
    render(
      <UserItem
        followUser={followUser}
        currentUser={currentUser}
        isFollowing={true}
        followId={followUser.follow_id}
      />,
    );
    expect(screen.getByText("MockFollowButton")).toBeInTheDocument();
  });
});
