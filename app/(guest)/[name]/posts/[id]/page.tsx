import type { Metadata } from "next";
import type { Post } from "@/app/types/Post";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { fetchPost } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";
import { LikeArea } from "@/app/components/molecules/LikeArea";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  const post: Post = await fetchPost(id);

  return {
    title: `${post.title}`,
  };
}

export default async function PostShowPage(props: {
  params: Promise<{ id: string; name: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const name = params.name;

  const post: Post = await fetchPost(id);

  if (post.user.name !== decodeURIComponent(name)) {
    redirect("/");
  }

  return (
    <DefaultLayout className="dark:bg-background py-12">
      <section className="h-full px-4 py-6">
        <h1 className="text-3xl font-bold dark:text-blue-400">{post.title}</h1>

        <ul className="mt-4 flex flex-wrap items-center gap-1">
          <i className="bi bi-tag"></i>
          {post.tags.map((tag) => (
            <li key={tag.id}>
              <Link
                href={`/tags/${tag.name}`}
                className="rounded-sm bg-gray-200 px-1.5 text-sm hover:bg-gray-300 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-2 flex text-base">
          by
          <Link href={`/${post.user.name}`} className="hover:underline">
            <Image
              src={post.user.image ?? "/noavatar.png"}
              alt="ユーザー画像"
              width={24}
              height={24}
              className="ml-1 inline-block rounded-[50%]"
            />
            {post.user.name}
          </Link>
        </p>
        <SessionProvider>
          <LikeArea post={post} />
        </SessionProvider>

        <div className="mt-12">
          <div className="markdown-body !text-foreground dark:bg-background !bg-background">
            <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
