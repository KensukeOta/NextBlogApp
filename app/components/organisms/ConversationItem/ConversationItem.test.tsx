/* eslint-disable @next/next/no-img-element */

import type { Conversation } from "@/app/types/Conversation";
import { describe, test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// next/imageをimgでモック
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt || ""} />
  ),
}));

// next/linkをaタグでモック
vi.mock("next/link", () => ({
  __esModule: true,
  default: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    function MockLink(props, ref) {
      return <a ref={ref} {...props} />;
    },
  ),
}));

afterEach(() => {
  cleanup();
});

// ダミーデータ
const baseConversation: Conversation = {
  partner: {
    id: "user2",
    name: "テストユーザー",
    image: "/user2.png",
  },
  last_message: {
    id: "msg-1",
    from_user_id: "user2",
    to_user_id: "me",
    content: "こんにちは！",
    read: false,
    created_at: "2024-08-04T12:00:00Z",
  },
  unread_count: 0,
};

describe("<ConversationItem />", () => {
  // ユーザー名、画像、最新メッセージが表示される
  test("renders partner name, avatar, and last message", async () => {
    const { ConversationItem } = await import("./ConversationItem");
    render(<ConversationItem conversation={baseConversation} />);
    // ユーザー名
    expect(screen.getByText("テストユーザー")).toBeInTheDocument();
    // メッセージ
    expect(screen.getByText("こんにちは！")).toBeInTheDocument();
    // 画像
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/user2.png");
    expect(img.width).toBe(48);
    expect(img.height).toBe(48);
    // Link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/messages/user2");
  });

  // 画像がnullなら/noavatar.pngが使われる
  test("uses /noavatar.png if partner.image is null", async () => {
    const { ConversationItem } = await import("./ConversationItem");
    render(
      <ConversationItem
        conversation={{
          ...baseConversation,
          partner: { ...baseConversation.partner, image: null as unknown as string },
        }}
      />,
    );
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img.src).toContain("/noavatar.png");
  });

  // 未読数が表示される
  test("shows unread_count if greater than 0", async () => {
    const { ConversationItem } = await import("./ConversationItem");
    render(<ConversationItem conversation={{ ...baseConversation, unread_count: 3 }} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    // 未読バッジはtext-white, bg-blue-600クラス持つ
    const badge = screen.getByText("3");
    expect(badge).toHaveClass("text-white");
    expect(badge).toHaveClass("bg-blue-600");
    // ユーザー名の色も青
    const username = screen.getByText("テストユーザー");
    expect(username).toHaveClass("text-blue-800");
  });

  // 未読数0ならバッジなし・ユーザー名は黒
  test("hides unread badge and username is black if unread_count is 0", async () => {
    const { ConversationItem } = await import("./ConversationItem");
    render(<ConversationItem conversation={{ ...baseConversation, unread_count: 0 }} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    const username = screen.getByText("テストユーザー");
    expect(username).toHaveClass("text-black");
  });

  // 最新メッセージの内容が省略されず表示される（truncateクラス）
  test("renders last message with truncate class", async () => {
    const { ConversationItem } = await import("./ConversationItem");
    render(<ConversationItem conversation={baseConversation} />);
    const msg = screen.getByText("こんにちは！");
    expect(msg).toHaveClass("truncate");
  });
});
