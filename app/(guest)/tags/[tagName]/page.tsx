import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { fetchFilteredPosts } from "@/app/lib/data";
import { PostItem } from "@/app/components/organisms/PostItem";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";

export function generateMetadata(
  { params }: { params: { tagName: string } }
): Metadata {
  const tagName = decodeURIComponent(params.tagName);

  return {
    title: `#${tagName}がつけられた記事一覧`,
  };
}

export default async function Page({
  params
}: {
  params: { tagName: string }
}) {
  const posts: Post[] = await fetchFilteredPosts(params.tagName, 1);

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
    <DefaultLayout className="p-4">
      <h1 className="font-bold">#{`「${decodeURIComponent(params.tagName)}」のタグがつけられた記事`}</h1>

      <section className="mt-4">
        {postItems}
      </section>
    </DefaultLayout>
  );
}