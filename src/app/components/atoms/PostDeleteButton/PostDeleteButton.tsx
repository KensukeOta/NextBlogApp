"use client";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { Post } from "@/app/types/Post";
import { useForm } from "react-hook-form";

export const PostDeleteButton: FC = () => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Post>();

  const onSubmit: SubmitHandler<Post> = async () => {
    
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="inline-block">
      <button disabled={isSubmitting} className="text-red-500">削除</button>
    </form>
  );
};