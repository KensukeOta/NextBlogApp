import type { FC } from "react";
import type { PostProps } from "@/app/types/PostProps";
import Link from "next/link";

export const PostEditLinkButton: FC<PostProps> = ({ post }) => {
  return (
    <Link href={`/${post.user.name}/posts/${post.id}/edit`} className="text-green-500">
      更新
    </Link>
  );
};