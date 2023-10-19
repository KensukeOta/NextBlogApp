import type { Metadata } from "next";
import { getAuthUser } from "@/app/lib/getAuthUser";
import { PostForm } from "@/app/components/organisms/PostForm";
import { User } from "@/app/types/User";

export const metadata: Metadata = {
  title: "記事投稿フォーム - NextBlogApp",
};

export default async function PostCreatePage() {
  const authUser = await getAuthUser();

  return (
    <PostForm authUser = {authUser} />
  );
}