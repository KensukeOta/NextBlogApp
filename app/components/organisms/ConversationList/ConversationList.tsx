"use client";

import type { Conversation } from "@/app/types/Conversation";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { ConversationItem } from "@/app/components/organisms/ConversationItem";

export const ConversationList = ({ conversations }: { conversations: Conversation[] }) => {
  // 入力用
  const [inputValue, setInputValue] = useState("");
  // 検索用（ディレイ付き）
  const [search] = useDebounce(inputValue, 300);

  const filtered = conversations.filter((c) =>
    c.partner.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"></i>
          <input
            placeholder="ユーザー名で検索"
            className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-blue-200 px-3 py-2 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button className="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:cursor-pointer hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          <i className="bi bi-plus mr-2 text-base"></i>
          新規メッセージ
        </button>
      </div>
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((c) => <ConversationItem key={c.partner.id} conversation={c} />)
        ) : (
          <p className="text-center font-bold">メッセージがありません</p>
        )}
      </div>
    </>
  );
};
