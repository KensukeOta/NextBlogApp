import { Metadata } from "next";
import { PostForm } from "@/app/components/organisms/PostForm";

export const metadata: Metadata = {
  title: "記事投稿フォーム",
};

export default async function() {
  return (
    <PostForm />
  );
}