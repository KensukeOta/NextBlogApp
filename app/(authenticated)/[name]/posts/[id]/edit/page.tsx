import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchPost } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";
import { PostEditForm } from "@/app/components/organisms/PostEditForm";

export const metadata: Metadata = {
  title: "記事更新フォーム",
};

export default async function PostEditPage(props: {
  params: Promise<{ id: string; name: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const name = params.name;

  const post: Post = await fetchPost(id);

  const session = await auth();

  if (
    !session?.user ||
    session.user.id !== post.user_id.toString() ||
    post.user.name !== decodeURIComponent(name)
  ) {
    redirect("/");
  }

  return (
    <DefaultLayout className="py-3">
      <PostEditForm post={post} />
    </DefaultLayout>
  );
}
