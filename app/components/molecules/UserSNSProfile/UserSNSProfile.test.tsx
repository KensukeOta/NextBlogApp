import type { User } from "@/app/types/User";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, test, afterEach, expect } from "vitest";
import { UserSNSProfile } from "./UserSNSProfile";

const baseUser: User = {
  id: "1",
  name: "testuser",
  email: "test@example.com",
  image: "",
  provider: "github",
  bio: "",
  posts: [],
  liked_posts: [],
  user_social_profiles: [],
};

afterEach(cleanup);

describe("UserSNSProfile", () => {
  // タイトル「SNS」が表示されることをテスト
  test("renders title SNS", () => {
    render(<UserSNSProfile user={baseUser} />);
    expect(screen.getByText("SNS")).toBeInTheDocument();
  });

  // すべてのSNSリンク（X, Instagram, YouTube）が正しく表示されることをテスト
  test("renders twitter, instagram, and youtube links if present", () => {
    const user: User = {
      ...baseUser,
      user_social_profiles: [
        { id: "hoge", provider: "twitter", url: "https://twitter.com/testuser" },
        { id: "hoge", provider: "instagram", url: "https://instagram.com/testuser" },
        { id: "hoge", provider: "youtube", url: "https://youtube.com/testuser" },
      ],
    };
    render(<UserSNSProfile user={user} />);
    expect(screen.getByText("X (Twitter)")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("YouTube")).toBeInTheDocument();

    expect(screen.getByText("X (Twitter)").closest("a")).toHaveAttribute(
      "href",
      "https://twitter.com/testuser",
    );
    expect(screen.getByText("Instagram").closest("a")).toHaveAttribute(
      "href",
      "https://instagram.com/testuser",
    );
    expect(screen.getByText("YouTube").closest("a")).toHaveAttribute(
      "href",
      "https://youtube.com/testuser",
    );
  });

  // Twitterだけ登録されている場合は他のSNSが表示されないことをテスト
  test("renders only twitter if only twitter profile exists", () => {
    const user: User = {
      ...baseUser,
      user_social_profiles: [
        { id: "hoge", provider: "twitter", url: "https://twitter.com/testuser" },
      ],
    };
    render(<UserSNSProfile user={user} />);
    expect(screen.getByText("X (Twitter)")).toBeInTheDocument();
    expect(screen.queryByText("Instagram")).not.toBeInTheDocument();
    expect(screen.queryByText("YouTube")).not.toBeInTheDocument();
  });

  // SNSプロフィールが1つもない場合は何もリンクが表示されないことをテスト
  test("renders nothing if no social profiles", () => {
    render(<UserSNSProfile user={baseUser} />);
    expect(screen.queryByText("X (Twitter)")).not.toBeInTheDocument();
    expect(screen.queryByText("Instagram")).not.toBeInTheDocument();
    expect(screen.queryByText("YouTube")).not.toBeInTheDocument();
  });

  // 各リンクが target="_blank" を持つことをテスト
  test("links have target _blank", () => {
    const user: User = {
      ...baseUser,
      user_social_profiles: [
        { id: "hoge", provider: "twitter", url: "https://twitter.com/testuser" },
      ],
    };
    render(<UserSNSProfile user={user} />);
    const link = screen.getByText("X (Twitter)").closest("a");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
