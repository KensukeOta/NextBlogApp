"use client";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { Post } from "@/app/types/Post";
import type { PostProps } from "@/app/types/PostProps";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export const PostDeleteButton: FC<PostProps> = ({ post }) => {
  const router = useRouter();
  
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Post>();

  const onSubmit: SubmitHandler<Post> = async () => {
    if (!confirm("この記事を削除しますか？")) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? ""
        },
        credentials: "include"
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="inline-block">
      <button disabled={isSubmitting} className="text-red-500">削除</button>
    </form>
  );
};