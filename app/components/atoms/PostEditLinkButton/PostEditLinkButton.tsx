import type { Post } from "@/app/types/Post";
import Link from "next/link";

export const PostEditLinkButton = ({ post }: { post: Post }) => {
  return (
    <Link href={`/${post.user.name}/posts/${post.id}/edit`} className="text-green-500">
      更新
    </Link>
  );
};
