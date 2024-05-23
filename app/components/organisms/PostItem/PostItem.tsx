import type { Post } from "@/app/types/Post";
import Link from "next/link";
import { auth } from "@/auth";
import { PostEditLinkButton } from "@/app/components/atoms/PostEditLinkButton";

export const PostItem = async ({ post }: { post: Post }) => {
  const session = await auth();
  
  return (
    <article className="border p-2">
      <h2 className="font-bold">
        <Link href={`/${post.user.name}/posts/${post.id}`} className="inline-block w-full hover:underline">
          {post.title}
        </Link>
      </h2>

      <nav className="flex justify-between">
        by {post.user.name}
        {session?.user && session.user.id === post.user_id ? <PostEditLinkButton post={post} /> : null}
      </nav>
    </article>
  );
};