import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/getAuthUser";
import { getPost } from "@/app/lib/getPost";
import { PostEditForm } from "@/app/components/organisms/PostEditForm";

export const metadata: Metadata = {
  title: "記事更新フォーム - NextBlogApp",
};

export default async function PostEditPage({
  params: { id, name },
}: {
  params: { id: number, name: string }
}) {
  const authUser = await getAuthUser();
  const post = await getPost(id);

  if (!authUser || authUser.id !== post.user_id || post.user.name !== name) {
    redirect("/");
  }

  return (
    <PostEditForm post={post} />
  );
}