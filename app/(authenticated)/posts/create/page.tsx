import type { Metadata } from "next";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";
import { PostForm } from "@/app/components/organisms/PostForm";

export const metadata: Metadata = {
  title: "記事投稿フォーム",
};

export default async function PostPage() {
  return (
    <DefaultLayout className="py-3">
      <PostForm />
    </DefaultLayout>
  );
}
