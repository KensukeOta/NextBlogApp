import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { fetchPost } from "@/app/lib/data";
import { UserIcon } from "@/app/components/atoms/UserIcon";

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const id = params.id;
  const post: Post = await fetchPost(id);

  return {
    title: `${post.title}`,
  };
}

export default async function Page({
  params: { id, name }
}: {
  params: { id: string, name: string }
}) {
  const post: Post = await fetchPost(id);

  if (post.user.name !== decodeURIComponent(name)) {
    redirect("/");
  }

  return (
    <section>
      <h1 className="font-bold text-3xl">{post.title}</h1>
      <p className="flex mt-2 text-base">by <UserIcon user={post.user} width={24} height={24} />{post.user.name}</p>

      <div className="mt-12">
        <Markdown remarkPlugins={[remarkGfm]} className="markdown-body">{post.body}</Markdown>
      </div>
    </section>
  );
}