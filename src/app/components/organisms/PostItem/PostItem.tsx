import type { FC } from "react";
import type { AuthUser } from "@/app/types/AuthUser";
import type { PostProps } from "@/app/types/PostProps";
import Link from "next/link";
import { PostEditLinkButton } from "../../atoms/PostEditLinkButton";
import { PostDeleteButton } from "../../atoms/PostDeleteButton";

export const PostItem: FC<AuthUser & PostProps> = ({ authUser, post }) => {
  return (
    <article className="border p-2">
      <h2 className="font-bold">
        <Link href={`/${post.user.name}/posts/${post.id}`} className="inline-block w-full hover:underline">
          {post.title}
        </Link>
      </h2>

      <nav className="flex justify-between">
        by {post.user.name}
        {authUser && authUser.id === post.user_id ? <PostEditLinkButton post={post} /> : null}
        {authUser && authUser.id === post.user_id ? <PostDeleteButton post={post} /> : null}
      </nav>
    </article>
  );
};