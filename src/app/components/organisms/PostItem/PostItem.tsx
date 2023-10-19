import type { FC } from "react";
import type { PostProps } from "@/app/types/PostProps";

export const PostItem: FC<PostProps> = ({ post }) => {
  return (
    <article className="border p-2">
      <h2 className="font-bold">Test</h2>
      <nav className="flex justify-between">
        by kensuke
      </nav>
    </article>
  );
};