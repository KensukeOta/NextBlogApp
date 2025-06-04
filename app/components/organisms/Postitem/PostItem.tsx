import { Post } from "@/app/types/Post";
import Link from "next/link";
import { auth } from "@/auth";
import { PostEditLinkButton } from "../../atoms/PostEditLinkButton";
import { PostDeleteButton } from "../../atoms/PostDeleteButton";

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

      <nav className="flex justify-between">
        <p>by {post.user.name}</p>
        {session?.user && session.user.id === post.user_id.toString() ? (
          <PostEditLinkButton post={post} />
        ) : null}
        {session?.user && session.user.id === post.user_id.toString() ? (
          <PostDeleteButton post={post} />
        ) : null}
      </nav>
    </article>
  );
};
