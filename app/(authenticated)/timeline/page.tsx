import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchTimeline } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";
import { PostItem } from "@/app/components/organisms/PostItem";

export const metadata: Metadata = {
  title: "タイムライン",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const posts: Post[] = await fetchTimeline(session?.user?.id as string);

  const postItems = posts.length > 0 ? (
    posts.map(post => (
      <PostItem
        key={post.id}
        post={post}
      />
    ))
  ) : (
    <p className="font-bold text-center">記事が投稿されていません</p>
  );

  return (
    <DefaultLayout className="py-6">
      <h1 className="font-bold mt-2">タイムライン</h1>
      
      <section className="mt-2">
        {postItems}
      </section>
    </DefaultLayout>
  );
}
