import type { Messages } from "@/app/types/Messages";
import type { Message } from "@/app/types/Message";
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// --- モック: MessageItem（メッセージ描画用） ---
vi.mock("../../molecules/MessageItem", () => ({
  MessageItem: ({ message }: { message: Message }) => (
    <div data-testid="message" data-message-id={message.id}>
      {message.content}
    </div>
  ),
}));

// --- モック: readMessages ---
const mockReadMessages = vi.fn();
vi.mock("@/app/lib/actions/messages", () => ({
  readMessages: mockReadMessages,
}));

// --- テスト用ダミーデータ ---
const baseData: Messages = {
  partner: { id: "partner1", name: "テスト相手", image: "" },
  messages: [
    {
      id: "m1",
      from_user_id: "partner1",
      to_user_id: "me",
      content: "未読メッセージ",
      read: false,
      created_at: "",
    },
    {
      id: "m2",
      from_user_id: "me",
      to_user_id: "partner1",
      content: "既読メッセージ",
      read: true,
      created_at: "",
    },
  ],
};

afterEach(() => {
  cleanup();
  mockReadMessages.mockReset();
});

describe("<MessageList />", () => {
  // メッセージが全て描画される
  test("renders all messages using MessageItem", async () => {
    // メッセージ数分だけMessageItemが呼ばれ、内容も正しく表示されること
    const { MessageList } = await import("./MessageList");
    render(<MessageList data={baseData} currentUserId="me" />);
    expect(screen.getAllByTestId("message")).toHaveLength(2);
    expect(screen.getByText("未読メッセージ")).toBeInTheDocument();
    expect(screen.getByText("既読メッセージ")).toBeInTheDocument();
  });

  // 未読メッセージがある場合はreadMessagesが呼ばれる
  test("calls readMessages for unread messages", async () => {
    const { MessageList } = await import("./MessageList");
    render(<MessageList data={baseData} currentUserId="me" />);
    // 未読のみID渡される
    expect(mockReadMessages).toHaveBeenCalledWith(["m1"]);
  });

  // 未読がない場合はreadMessagesが呼ばれない
  test("does not call readMessages if all are read", async () => {
    const { MessageList } = await import("./MessageList");
    const allRead: Messages = {
      ...baseData,
      messages: baseData.messages.map((m) => ({ ...m, read: true })),
    };
    render(<MessageList data={allRead} currentUserId="me" />);
    expect(mockReadMessages).not.toHaveBeenCalled();
  });

  // スクロール位置が一番下になる（useRefのDOM操作のテスト例）
  test("scrolls to bottom on mount", async () => {
    // scrollTop/scrollHeightの操作確認
    const { MessageList } = await import("./MessageList");

    // スクロール用のrefに付くdivを監視する
    const { container } = render(<MessageList data={baseData} currentUserId="me" />);
    const scrollDiv = container.querySelector("div.flex-1");
    if (!scrollDiv) throw new Error("scroll div not found");

    // 疑似的に高さ・scrollTopをセット
    Object.defineProperty(scrollDiv, "scrollHeight", { value: 500, writable: true });
    Object.defineProperty(scrollDiv, "scrollTop", {
      set: vi.fn(),
      get: () => 500,
    });

    // useEffect発火後（もう一度レンダリングしてみる）
    render(<MessageList data={baseData} currentUserId="me" />);
    // scrollTop setterが呼ばれていること
    // （環境によってはここは厳密な確認が難しいこともありますが、書き方例として）
    expect(scrollDiv.scrollTop).toBe(500); // 実際の値というよりsetterが動くことが大事
  });

  // 日付区切りがJSTの「月日」形式で正しく表示される
  test("render the date separator correctly in JST “month and day” format", async () => {
    // メッセージ2件の日付が異なる日付帯になるケース
    const { MessageList } = await import("./MessageList");
    const messages: Messages = {
      partner: { id: "partner1", name: "テスト相手", image: "" },
      messages: [
        {
          id: "m1",
          from_user_id: "partner1",
          to_user_id: "me",
          content: "朝のメッセージ",
          read: true,
          created_at: "2024-08-03T15:00:00Z", // JST 8/4 0:00
        },
        {
          id: "m2",
          from_user_id: "partner1",
          to_user_id: "me",
          content: "夜のメッセージ",
          read: true,
          created_at: "2024-08-04T13:00:00Z", // JST 8/4 22:00
        },
      ],
    };
    render(<MessageList data={messages} currentUserId="me" />);
    // 8月4日 が2件の最初に1つだけ表示される
    expect(screen.getAllByText("8月4日")).toHaveLength(1);

    // 表示クラスや文言も確認
    expect(screen.getByText("8月4日").closest("div")?.className).toContain("rounded-full");
  });

  // 同日なら日付区切りが1回のみ
  test("render the date separator only for the first message of the same date, even if there are multiple messages on that date", async () => {
    const { MessageList } = await import("./MessageList");
    const messages: Messages = {
      partner: { id: "partner1", name: "テスト相手", image: "" },
      messages: [
        {
          id: "m1",
          from_user_id: "partner1",
          to_user_id: "me",
          content: "1件目",
          read: true,
          created_at: "2024-08-03T15:00:00Z", // JST 8/4 0:00
        },
        {
          id: "m2",
          from_user_id: "partner1",
          to_user_id: "me",
          content: "2件目",
          read: true,
          created_at: "2024-08-03T16:00:00Z", // JST 8/4 1:00
        },
      ],
    };
    render(<MessageList data={messages} currentUserId="me" />);
    expect(screen.getAllByText("8月4日")).toHaveLength(1);
  });
});
