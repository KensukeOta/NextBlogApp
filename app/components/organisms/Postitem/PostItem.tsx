import type { Post } from "@/app/types/Post";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { PostEditLinkButton } from "../../atoms/PostEditLinkButton";
import { PostDeleteButton } from "../../atoms/PostDeleteButton";
import { LikeArea } from "../../molecules/LikeArea";

export const PostItem = async ({ post }: { post: Post }) => {
  const session = await auth();

  return (
    <article className="border bg-white p-2">
      <h2 className="text-left font-bold">
        <Link
          href={`/${post.user.name}/posts/${post.id}`}
          className="inline-block w-full hover:underline"
        >
          {post.title}
        </Link>
      </h2>

      <ul className="mt-1 flex flex-wrap items-center gap-1">
        <i className="bi bi-tag"></i>
        {post.tags.map((tag) => (
          <li key={tag.id}>
            <Link
              href={`/tags/${tag.name}`}
              className="rounded-sm bg-gray-200 px-1.5 text-sm hover:bg-gray-300"
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-1">
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

      <nav className="mt-1 flex justify-between">
        <LikeArea post={post} />
        {session?.user && session.user.id === String(post.user_id) ? (
          <PostEditLinkButton post={post} />
        ) : null}
        {session?.user && session.user.id === String(post.user_id) ? (
          <PostDeleteButton post={post} />
        ) : null}
      </nav>
    </article>
  );
};
