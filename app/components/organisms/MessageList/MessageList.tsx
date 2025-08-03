"use client";

import type { Messages } from "@/app/types/Messages";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { readMessages } from "@/app/lib/actions/messages";

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
      {data.messages.map((message) => {
        const isMyMessage = message.from_user_id === currentUserId;
        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isMyMessage ? "justify-end" : "justify-start"} mt-4`}
          >
            {!isMyMessage && (
              <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={data.partner.image ?? "/noavatar.png"}
                  height={32}
                  width={32}
                  alt="ユーザー画像"
                />
              </span>
            )}
            <div className="order-1 max-w-xs lg:max-w-md">
              <div
                className={`rounded-2xl px-4 py-2 ${isMyMessage ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md bg-gray-100 text-gray-800"}`}
              >
                <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
