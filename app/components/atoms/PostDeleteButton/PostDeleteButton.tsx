"use client";

import type { Post } from "@/app/types/Post";
import { useActionState } from "react";
import { deletePost } from "@/app/lib/actions/posts";

export const PostDeleteButton = ({ post }: { post: Post }) => {
  const [, formAction, isPending] = useActionState(async () => {
    // confirmのUIはここで
    if (!confirm("この記事を削除しますか？")) {
      return;
    }
    await deletePost(post.id);
  }, undefined);

  return (
    <form action={formAction} className="inline-block">
      <button
        type="submit"
        disabled={isPending}
        className="text-red-500 hover:cursor-pointer disabled:cursor-default"
      >
        削除
      </button>
    </form>
  );
};
