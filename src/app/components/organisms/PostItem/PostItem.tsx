import type { FC } from "react";
import type { PostProps } from "@/app/types/PostProps";
import Link from "next/link";
import { PostEditLinkButton } from "../../atoms/PostEditLinkButton";

export const PostItem: FC<PostProps> = ({ post }) => {
  return (
    <article className="border p-2">
      <h2 className="font-bold">
        <Link href={`/${post.user.name}/posts/${post.id}`} className="inline-block w-full hover:underline">
          {post.title}
        </Link>
      </h2>

      <nav className="flex justify-between">
        by {post.user.name}
        <PostEditLinkButton post={post} />
      </nav>
    </article>
  );
};