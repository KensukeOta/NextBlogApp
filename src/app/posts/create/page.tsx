import type { Metadata } from "next";
import { PostForm } from "@/app/components/organisms/PostForm";

export const metadata: Metadata = {
  title: "記事投稿フォーム - NextBlogApp",
};

export default async function PostCreatePage() {
  return (
    <PostForm />
  );
}