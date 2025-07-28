"use client";

import type { Post } from "@/app/types/Post";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import { createLike, deleteLike } from "@/app/lib/actions/likes";

export const LikeArea = ({ post }: { post: Post }) => {
  const { data: session } = useSession();
  // ログインユーザーが「いいね」したかどうかを確認し、「いいね」データを取得
  const liked = post.likes.find((like) => like.user_id === session?.user.id);

  const [, formAction, isPending] = useActionState(async () => {
    if (!session) {
      alert("ログインすると「いいね」をすることができます！");
      return;
    }

    if (liked) {
      deleteLike(liked.id);
    } else {
      createLike(post.id);
    }
  }, undefined);

  return (
    <form action={formAction} className="flex gap-1">
      <button
        type="submit"
        disabled={isPending}
        aria-label={liked ? "いいねを取り消す" : "いいねする"}
        className={`rounded-[50%] hover:cursor-pointer disabled:cursor-default ${liked ? "text-red-500 hover:bg-gray-200" : "hover:bg-pink-100 hover:text-red-500"}`}
      >
        <i className={`${liked ? "bi bi-heart-fill" : "bi bi-heart"}`}></i>
      </button>
      <span data-testid="like-count">{post.likes.length}</span>
    </form>
  );
};
