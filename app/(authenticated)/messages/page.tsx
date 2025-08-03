import type { Conversation } from "@/app/types/Conversation";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchAllConversations } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";
import { ConversationItem } from "@/app/components/organisms/ConversationItem";

export default async function ConversationPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const conversations: Conversation[] = await fetchAllConversations();

  return (
    <DefaultLayout>
      <div className="xxl:max-w-[1400px] mx-auto h-full w-full px-4 py-6">
        <div>
          <h2 className="text-2xl font-bold">メッセージ</h2>
          <p className="mt-1 text-slate-500">
            他のユーザーとのメッセージのやり取りを管理できます。
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-4xl">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"></i>
              <input
                placeholder="ユーザー名で検索"
                className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-blue-200 px-3 py-2 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button className="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:cursor-pointer hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
              <i className="bi bi-plus mr-2 text-base"></i>
              新規メッセージ
            </button>
          </div>

          <div className="space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <ConversationItem key={conversation.partner.id} conversation={conversation} />
              ))
            ) : (
              <p className="text-center font-bold">メッセージがありません</p>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
