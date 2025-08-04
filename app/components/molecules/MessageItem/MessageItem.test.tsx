/* eslint-disable @next/next/no-img-element */

import type { Message } from "@/app/types/Message";
import type { Messages } from "@/app/types/Messages";
import { describe, test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// next/imageをモック（表示上はimgにする）
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt || ""} />
  ),
}));

afterEach(() => {
  cleanup();
});

// ダミーデータ
const baseData: Messages = {
  partner: {
    id: "user2",
    name: "パートナー",
    image: "/partner.png",
  },
  messages: [],
};

const myMessage: Message = {
  id: "msg1",
  from_user_id: "me",
  to_user_id: "user2",
  content: "これは自分のメッセージ",
  read: true,
  created_at: "2024-08-04T01:00:00Z",
};

const partnerMessage: Message = {
  id: "msg2",
  from_user_id: "user2",
  to_user_id: "me",
  content: "これは相手のメッセージ",
  read: true,
  created_at: "2024-08-04T02:00:00Z",
};

describe("<MessageItem />", () => {
  // 自分のメッセージが右寄せでアバターなしで表示される
  test("renders own message right-aligned without avatar", async () => {
    const { MessageItem } = await import("./MessageItem");
    render(<MessageItem data={baseData} message={myMessage} currentUserId="me" />);
    const msg = screen.getByText("これは自分のメッセージ");
    expect(msg).toBeInTheDocument();

    // 右寄せ
    const wrapper = msg.closest("div.flex");
    expect(wrapper).toHaveClass("justify-end");

    // アバター画像は表示されない
    expect(screen.queryByAltText("ユーザー画像")).not.toBeInTheDocument();
  });

  // 相手のメッセージが左寄せ＋アバター表示で表示される
  test("renders partner message left-aligned with avatar", async () => {
    const { MessageItem } = await import("./MessageItem");
    render(<MessageItem data={baseData} message={partnerMessage} currentUserId="me" />);
    const msg = screen.getByText("これは相手のメッセージ");
    expect(msg).toBeInTheDocument();

    // 左寄せ
    const wrapper = msg.closest("div.flex");
    expect(wrapper).toHaveClass("justify-start");

    // アバター画像表示
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/partner.png");
    expect(img.width).toBe(32);
    expect(img.height).toBe(32);
  });

  // パートナー画像がnullのときnoavatar.pngになる
  test("uses /noavatar.png if partner image is null", async () => {
    const { MessageItem } = await import("./MessageItem");
    const dataNoImg: Messages = {
      ...baseData,
      partner: { ...baseData.partner, image: null as unknown as string },
    };
    render(<MessageItem data={dataNoImg} message={partnerMessage} currentUserId="me" />);
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img.src).toContain("/noavatar.png");
  });

  // 改行や長文も正しく表示される
  test("renders multi-line content properly", async () => {
    const { MessageItem } = await import("./MessageItem");
    const multiMsg: Message = { ...myMessage, content: "1行目\n2行目" };
    render(<MessageItem data={baseData} message={multiMsg} currentUserId="me" />);
    // 改行も含む内容を部分一致で判定
    expect(
      screen.getByText(
        (content, element) =>
          content.includes("1行目") &&
          content.includes("2行目") &&
          // p要素であることも念のため確認
          element?.tagName.toLowerCase() === "p",
      ),
    ).toBeInTheDocument();
  });

  // 送信時間が日本時間で表示されることをテスト
  test("render the message's sent time in JST (Japan Standard Time)", async () => {
    const { MessageItem } = await import("./MessageItem");
    // created_at: "2024-08-04T01:00:00Z" → JST: 10:00
    render(<MessageItem data={baseData} message={myMessage} currentUserId="me" />);
    // JST 10:00 になる
    expect(screen.getByText("10:00")).toBeInTheDocument();

    // partnerMessage: created_at: "2024-08-04T02:00:00Z" → JST: 11:00
    render(<MessageItem data={baseData} message={partnerMessage} currentUserId="me" />);
    expect(screen.getByText("11:00")).toBeInTheDocument();
  });
});
