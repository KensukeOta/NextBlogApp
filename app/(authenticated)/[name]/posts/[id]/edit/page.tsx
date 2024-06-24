import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchPost } from "@/app/lib/data";
import { PostEditForm } from "@/app/components/organisms/PostEditForm";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";

export const metadata: Metadata = {
  title: "記事更新フォーム",
};

export default async function Page({ params }: { params: { id: string, name: string } }) {
  const id = params.id;
  const post = await fetchPost(id);

  const session = await auth();

  if (!session?.user || session.user.id !== post.user_id || post.user.name !== decodeURIComponent(params.name)) {
    redirect("/");
  }
  
  return (
    <DefaultLayout className="py-3">
      <PostEditForm post={post}  />
    </DefaultLayout>
  );
}