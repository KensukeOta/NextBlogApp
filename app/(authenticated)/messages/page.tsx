import type { Conversation } from "@/app/types/Conversation";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchAllConversations } from "@/app/lib/data";
import { ConversationList } from "@/app/components/organisms/ConversationList";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";

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
          <ConversationList conversations={conversations} />
        </div>
      </div>
    </DefaultLayout>
  );
}
