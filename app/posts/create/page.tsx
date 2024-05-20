import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { PostForm } from "@/app/components/organisms/PostForm";

export const metadata: Metadata = {
  title: "記事投稿フォーム",
};

export default async function Page() {
  return (
    <SessionProvider>
      <PostForm />
    </SessionProvider>
  );
}