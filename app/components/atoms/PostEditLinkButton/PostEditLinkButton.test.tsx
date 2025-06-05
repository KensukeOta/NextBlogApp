import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Post } from "@/app/types/Post";
import type { User } from "@/app/types/User";
import { PostEditLinkButton } from "./PostEditLinkButton";

// テスト用ダミーUserとPost
const dummyUser: User = {
  id: "user1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "",
  provider: "credentials",
};

const makeDummyPost = (id: string): Post => ({
  id,
  title: "dummy title",
  content: "dummy content",
  user_id: dummyUser.id,
  user: dummyUser,
});

describe("<PostEditLinkButton />", () => {
  // リンクが正しく描画されること
  test("renders a link with correct href and label", () => {
    const post = makeDummyPost("42");

    render(<PostEditLinkButton post={post} />);

    // アクセシブルネーム「更新」でリンクを取得
    const link = screen.getByRole("link", { name: "更新" });

    expect(link).toBeInTheDocument();
    // hrefが意図通りか
    expect(link).toHaveAttribute("href", "/kensuke/posts/42/edit");
    // .text-green-500 クラスが付与されているか
    expect(link).toHaveClass("text-green-500");
  });
});
