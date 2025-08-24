import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";
import { PostForm } from "@/app/components/organisms/PostForm";

export const metadata: Metadata = {
  title: "記事投稿フォーム",
};

export default async function PostPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <DefaultLayout className="dark:bg-background py-3">
      <PostForm />
    </DefaultLayout>
  );
}
