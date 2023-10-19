import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/getAuthUser";
import { PostForm } from "@/app/components/organisms/PostForm";

export const metadata: Metadata = {
  title: "記事投稿フォーム - NextBlogApp",
};

export default async function PostCreatePage() {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/login");
  }

  return (
    <PostForm authUser={authUser} />
  );
}