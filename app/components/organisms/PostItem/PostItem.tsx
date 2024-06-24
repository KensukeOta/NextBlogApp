import type { Post } from "@/app/types/Post";
import Link from "next/link";
import { auth } from "@/auth";
import { PostEditLinkButton } from "@/app/components/atoms/PostEditLinkButton";
import { PostDeleteButton } from "@/app/components/atoms/PostDeleteButton";

export const PostItem = async ({ post }: { post: Post }) => {
  const session = await auth();
  
  return (
    <article className="border p-2">
      <h2 className="font-bold text-left">
        <Link href={`/${post.user.name}/posts/${post.id}`} className="inline-block w-full hover:underline">
          {post.title}
        </Link>
      </h2>

      <nav className="flex justify-between">
        <p>by <Link href={`/${post.user.name}`} className="hover:underline">{post.user.name}</Link></p>
        {session?.user && session.user.id === post.user_id ? <PostEditLinkButton post={post} /> : null}
        {session?.user && session.user.id === post.user_id ? <PostDeleteButton post={post} /> : null}
      </nav>
    </article>
  );
};