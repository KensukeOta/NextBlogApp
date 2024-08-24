"use client";

import type { Post } from "@/app/types/Post";
import { useSession } from "next-auth/react";
import { createLike, deleteLike } from "@/app/lib/actions";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";

export const LikeArea = ({ post }: { post: Post }) => {
  const session = useSession();

  // ログインユーザーが「いいね」したかどうかを確認し、「いいね」データを取得
  const liked = post.likes.find((like) => like.user_id === session.data?.user?.id);

  const handleSubmit = () => {
    if (!session.data?.user) {
      alert("ログインすると「いいね」をすることができます！");
      return;
    }
    
    if (liked) {
      deleteLike(liked.id);
    } else {
      createLike(session.data?.user?.id!, post.id);
    }
  };

  return (
    <form action={handleSubmit}>
      <section className="flex gap-1">
        <SubmitButton
          className={`rounded-full ${liked ? "text-red-500 hover:bg-gray-200" : "hover:text-red-500 hover:bg-pink-100"}`}
          ariaLabel={liked ? "いいね解除" : "いいね"}
        >
          <i className={`${liked ? "bi bi-heart-fill" : "bi bi-heart"}`}></i>
        </SubmitButton>
        <span>{post.likes.length}</span>
      </section>
    </form>
  );
};