"use client";

import type { Messages } from "@/app/types/Messages";
import type { Message } from "@/app/types/Message";
import Image from "next/image";

export const MessageItem = ({
  data,
  message,
  currentUserId,
}: {
  data: Messages;
  message: Message;
  currentUserId: string;
}) => {
  const isMyMessage = message.from_user_id === currentUserId;

  const formatToJSTTime = (datetimeString: string) => {
    const date = new Date(datetimeString);
    // JSTへ変換
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Tokyo",
    };
    return date.toLocaleTimeString("ja-JP", options);
  };

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
        <div className={`mt-1 ${isMyMessage ? "text-right" : "text-left"} text-xs text-gray-500`}>
          {formatToJSTTime(message.created_at)}
          {isMyMessage && message.read && <span className="ml-1">既読</span>}
        </div>
      </div>
    </div>
  );
};
