"use client";

import type { Post } from "@/app/types/Post";
import { deletePost } from "@/app/lib/actions";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";

export const PostDeleteButton = ({ post }: { post: Post }) => {
  const onSubmit = () => {
    if (!confirm("この記事を削除しますか？")) {
      return;
    }
    deletePost(post.id);
  };

  return (
    <form action={onSubmit} className="inline-block">
      <SubmitButton className="text-red-500">
        削除
      </SubmitButton>
    </form>
  );
};