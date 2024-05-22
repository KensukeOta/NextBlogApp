import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import { redirect } from "next/navigation";
import { fetchPost } from "@/app/lib/data";

export async function generateMetadata(
  { params }: { params: { id: number } }
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
  params: { id: number, name: string }
}) {
  const post: Post = await fetchPost(id);

  if (post.user.name !== name) {
    redirect("/");
  }

  return (
    <section>
      <h1 className="font-bold text-4xl">{post.title}</h1>
      <p className="mt-1">by {post.user.name}</p>

      <div className="mt-16">
        <p className="whitespace-pre-wrap">{post.body}</p>
      </div>
    </section>
  );
}