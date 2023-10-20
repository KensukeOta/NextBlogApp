import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { getPost } from "@/app/lib/getPost";

export async function generateMetadata(
  { params }: { params: { id: number } }
): Promise<Metadata> {
  const id = params.id;

  let post;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/posts/${id}`, {
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
    const data = await res.json();
    post = data.post;
  } catch (error) {
    console.log(error);
  }

  return {
    title: `${post.title} - NextBlogApp`,
  };
}

export default async function PostPage({
  params: { id, name },
}: {
  params: { id: number, name: string }
}) {
  const post = await getPost(id);

  if (post.user.name !== name) {
    redirect("/");
  }
  
  return (
    <section>
      <h1 className="font-bold text-4xl">{post.title}</h1>
      <p className="mt-1">by {post.user.name}</p>

      <div className="mt-16">
        <div className="markdown-body">
          <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
        </div>
      </div>
    </section>
  );
}