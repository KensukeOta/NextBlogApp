import type { Messages } from "@/app/types/Messages";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchAllMessages } from "@/app/lib/data";
import { MessageForm } from "@/app/components/organisms/MessageForm";
import { MessageList } from "@/app/components/organisms/MessageList";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";

export default async function MessagePage(props: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const params = await props.params;

  const data: Messages = await fetchAllMessages(params.id);

  return (
    <DefaultLayout>
      <div className="xxl:max-w-[1400px] mx-auto h-full w-full px-4 py-6">
        <div className="mx-auto flex h-[calc(100vh-200px)] max-w-4xl flex-col">
          <div className="text-card-foreground mb-4 rounded-lg border border-blue-100 bg-white">
            <div className="flex flex-col space-y-1.5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="/messages"
                    className="ring-offset-background focus-visible:ring-ring inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap text-blue-700 transition-colors hover:bg-slate-50 hover:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  >
                    <i className="bi bi-arrow-left"></i>
                    戻る
                  </Link>
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={data.partner.image ?? "/noavatar.png"}
                      width={40}
                      height={40}
                      alt="ユーザー画像"
                    />
                  </span>
                  <div>
                    <Link href={`/${encodeURIComponent(data.partner.name)}`}>
                      <h3 className="cursor-pointer font-semibold text-gray-800 transition-colors hover:text-blue-600">
                        {data.partner.name}
                      </h3>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-card-foreground flex h-full flex-1 flex-col rounded-lg border border-blue-100 bg-white">
            <MessageList data={data} currentUserId={session.user.id} />
            <div className="border-t border-blue-100 p-4">
              <MessageForm userId={data.partner.id} />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
