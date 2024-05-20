import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { PostForm } from "@/app/components/organisms/PostForm";

export const metadata: Metadata = {
  title: "記事投稿フォーム",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  
  return (
    <SessionProvider>
      <PostForm />
    </SessionProvider>
  );
}