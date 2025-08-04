"use client";

import type { Messages } from "@/app/types/Messages";
import { useEffect, useRef } from "react";
import { readMessages } from "@/app/lib/actions/messages";
import { MessageItem } from "../../molecules/MessageItem";

export const MessageList = ({ data, currentUserId }: { data: Messages; currentUserId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const formatJSTDate = (dateString: string) => {
    const date = new Date(dateString);
    const m = date.toLocaleDateString("ja-JP", { month: "long", timeZone: "Asia/Tokyo" });
    const d = date.toLocaleDateString("ja-JP", { day: "numeric", timeZone: "Asia/Tokyo" });
    return `${m}${d}`; // "8月3日"
  };

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

  let prevDate = "";

  return (
    <div ref={containerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
      {data.messages.map((message) => {
        // JST「月日」だけを抽出
        const thisDate = formatJSTDate(message.created_at);
        const showDateSeparator = thisDate !== prevDate;
        prevDate = thisDate;

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="my-4 flex items-center justify-center">
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {thisDate}
                </div>
              </div>
            )}
            <MessageItem data={data} message={message} currentUserId={currentUserId} />
          </div>
        );
      })}
    </div>
  );
};
