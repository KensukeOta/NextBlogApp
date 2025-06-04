import { Post } from "@/app/types/Post";
import Link from "next/link";
import { PostEditLinkButton } from "../../atoms/PostEditLinkButton";

export const PostItem = ({ post }: { post: Post }) => {
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
        <PostEditLinkButton post={post} />
      </nav>
    </article>
  );
};
