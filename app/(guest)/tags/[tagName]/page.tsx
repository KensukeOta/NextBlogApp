import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { fetchFilteredPosts } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";
import { TagPostsWithSession } from "@/app/components/organisms/TagPostsWithSession";

export async function generateMetadata(props: {
  params: Promise<{ tagName: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const tagName = decodeURIComponent(params.tagName);

  return {
    title: `${tagName}と関連がある記事一覧`,
  };
}

export default async function TagPage(props: { params: Promise<{ tagName: string }> }) {
  const params = await props.params;
  const tagName = decodeURIComponent(params.tagName);

  const posts: Post[] = await fetchFilteredPosts(tagName, 1);

  return (
    <DefaultLayout className="py-6">
      <h1 className="font-bold">#{`「${decodeURIComponent(params.tagName)}」と関連がある記事`}</h1>

      <TagPostsWithSession posts={posts} />
    </DefaultLayout>
  );
}
