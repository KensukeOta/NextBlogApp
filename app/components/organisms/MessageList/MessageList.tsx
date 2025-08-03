"use client";

import type { Messages } from "@/app/types/Messages";
import { useEffect, useRef } from "react";
import { readMessages } from "@/app/lib/actions/messages";
import { MessageItem } from "../../molecules/MessageItem";

export const MessageList = ({ data, currentUserId }: { data: Messages; currentUserId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // スクロール位置を一番下へ
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    const unreadMessageIds = data.messages
      .filter((msg) => msg.to_user_id === currentUserId && !msg.read)
      .map((msg) => msg.id);

    if (unreadMessageIds.length > 0) {
      readMessages(unreadMessageIds); // サーバーアクション経由で既読化
    }
  }, [data.messages, currentUserId]); // メッセージが更新されるたびに実行

  return (
    <div ref={containerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
      {data.messages.map((message) => (
        <MessageItem key={message.id} data={data} message={message} currentUserId={currentUserId} />
      ))}
    </div>
  );
};
