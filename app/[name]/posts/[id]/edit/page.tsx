import type { Metadata } from "next";
import { PostEditForm } from "@/app/components/organisms/PostEditForm";
import { fetchPost } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "記事更新フォーム",
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const post = await fetchPost(id)
  
  return (
    <PostEditForm post={post}  />
  );
}