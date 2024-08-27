import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { fetchPost } from "@/app/lib/data";
import { UserIcon } from "@/app/components/atoms/UserIcon";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";
import { LikeArea } from "@/app/components/molecules/LikeArea";

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
    <DefaultLayout className="py-12">
      <section className="h-full bg-white px-4 py-6">
        <h1 className="font-bold text-3xl">{post.title}</h1>

        <ul className="flex gap-1 mt-4">
          <i className="bi bi-tag"></i>
          {post.tags.map(tag => (
            <li key={tag.id}>
              <Link
                href={`/tags/${tag.name}`}
                className="bg-gray-100 px-1.5 text-sm text-black/60"
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>

        <p className="flex mt-2 text-base">by <Link href={`/${post.user.name}`} className="hover:underline"><UserIcon user={post.user} width={24} height={24} />{post.user.name}</Link></p>
        <SessionProvider>
          <LikeArea post={post} />
        </SessionProvider>

        <div className="mt-12">
          <Markdown remarkPlugins={[remarkGfm]} className="markdown-body">{post.body}</Markdown>
        </div>
      </section>
    </DefaultLayout>
  );
}