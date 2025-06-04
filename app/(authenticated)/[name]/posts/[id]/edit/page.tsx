import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { fetchPost } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";
import { PostEditForm } from "@/app/components/organisms/PostEditForm";

export const metadata: Metadata = {
  title: "記事更新フォーム",
};

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string; name: string }>;
}) {
  const { id } = await params;
  const post: Post = await fetchPost(id);

  return (
    <DefaultLayout className="py-3">
      <PostEditForm post={post} />
    </DefaultLayout>
  );
}
