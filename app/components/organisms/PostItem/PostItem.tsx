import type { Post } from "@/app/types/Post";
import Link from "next/link";

export const PostItem = ({ post }: {post: Post}) => {
  return (
    <article className="border p-2">
      <h2 className="font-bold">
        <Link href={`/${post.user.name}/posts/${post.id}`} className="inline-block w-full hover:underline">
          {post.title}
        </Link>
      </h2>

      <nav className="flex justify-between">
        by {post.user.name}
      </nav>
    </article>
  );
};