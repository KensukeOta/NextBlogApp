import type { Conversation } from "@/app/types/Conversation";
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

vi.mock("@/app/components/organisms/ConversationItem", () => ({
  ConversationItem: ({ conversation }: { conversation: Conversation }) => (
    <div data-testid="conversation-item">{conversation.partner.name}</div>
  ),
}));
vi.mock("use-debounce", () => ({
  useDebounce: (value: string) => [value],
}));

const conversations: Conversation[] = [
  {
    partner: { id: "u1", name: "Alice", image: "" },
    last_message: {
      id: "m1",
      from_user_id: "u1",
      to_user_id: "me",
      content: "Hi!",
      read: false,
      created_at: "2024-08-04T10:00:00Z",
    },
    unread_count: 2,
  },
  {
    partner: { id: "u2", name: "Bob", image: "" },
    last_message: {
      id: "m2",
      from_user_id: "me",
      to_user_id: "u2",
      content: "See you.",
      read: true,
      created_at: "2024-08-03T12:00:00Z",
    },
    unread_count: 0,
  },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<ConversationList />", () => {
  // 会話一覧が正しく表示される
  test("renders all conversation items", async () => {
    const { ConversationList } = await import("./ConversationList");
    render(<ConversationList conversations={conversations} />);
    expect(screen.getAllByTestId("conversation-item")).toHaveLength(2);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  // ユーザー名で絞り込みできる（検索input変更でフィルタリングされる）
  test("filters conversations by partner name", async () => {
    const { ConversationList } = await import("./ConversationList");
    render(<ConversationList conversations={conversations} />);
    const input = screen.getByPlaceholderText("ユーザー名で検索");
    fireEvent.change(input, { target: { value: "alice" } });
    await waitFor(() => {
      expect(screen.getAllByTestId("conversation-item")).toHaveLength(1);
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
  });

  // ユーザー名で一致しない場合は「メッセージがありません」表示
  test("shows no-message text when filter yields no results", async () => {
    const { ConversationList } = await import("./ConversationList");
    render(<ConversationList conversations={conversations} />);
    const input = screen.getByPlaceholderText("ユーザー名で検索");
    fireEvent.change(input, { target: { value: "notfound" } });
    await waitFor(() => {
      expect(screen.queryByTestId("conversation-item")).not.toBeInTheDocument();
      expect(screen.getByText("メッセージがありません")).toBeInTheDocument();
    });
  });

  // 新規メッセージボタンが表示される
  test("renders new message button", async () => {
    const { ConversationList } = await import("./ConversationList");
    render(<ConversationList conversations={conversations} />);
    expect(screen.getByRole("button", { name: /新規メッセージ/ })).toBeInTheDocument();
  });

  // 検索input初期値は空文字
  test("search input is initially empty", async () => {
    const { ConversationList } = await import("./ConversationList");
    render(<ConversationList conversations={conversations} />);
    const input = screen.getByPlaceholderText("ユーザー名で検索") as HTMLInputElement;
    expect(input.value).toBe("");
  });
});
