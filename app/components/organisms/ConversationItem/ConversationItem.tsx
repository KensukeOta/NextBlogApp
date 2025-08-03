import type { Conversation } from "@/app/types/Conversation";
import Image from "next/image";
import Link from "next/link";

export const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
  return (
    <div
      className={`text-card-foreground cursor-pointer rounded-lg border border-blue-100 ${conversation.unread_count > 0 ? "bg-blue-50" : "bg-white"} shadow-2xs transition-all hover:shadow-md`}
    >
      <Link href={`/messages/${conversation.partner.id}`}>
        <div className="p-4">
          <div className="flex items-center gap-4">
            <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image
                src={conversation.partner.image ?? "/noavatar.png"}
                width={48}
                height={48}
                alt="ユーザー画像"
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <h3
                  className={`font-bold ${conversation.unread_count > 0 ? "text-blue-800" : "text-black"}`}
                >
                  {conversation.partner.name}
                </h3>
                <div className="flex items-center gap-2">
                  {conversation.unread_count > 0 && (
                    <div className="focus:ring-ring hover:bg-primary/80 inline-flex items-center rounded-full border border-transparent bg-blue-600 px-2 py-1 text-xs font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden">
                      {conversation.unread_count}
                    </div>
                  )}
                </div>
              </div>
              <p className="truncate text-sm font-medium text-gray-800">
                {conversation.last_message.content}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
