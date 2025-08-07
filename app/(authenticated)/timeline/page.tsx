import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { fetchTimeline } from "@/app/lib/data";
import { PostItem } from "@/app/components/organisms/Postitem";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "タイムライン",
};

export default async function TimelinePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const posts: Post[] = await fetchTimeline();

  return (
    <DefaultLayout className="py-6">
      <h1 className="font-bold">タイムライン</h1>

      <SessionProvider>
        {posts.length > 0 ? (
          posts.map((post) => {
            return <PostItem key={post.id} post={post} />;
          })
        ) : (
          <p className="text-center font-bold">記事が投稿されていません</p>
        )}
      </SessionProvider>
    </DefaultLayout>
  );
}
