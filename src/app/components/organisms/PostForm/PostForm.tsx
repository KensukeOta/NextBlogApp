"use client";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { Post } from "@/app/types/Post";
import type { AuthUser } from "@/app/types/AuthUser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export const PostForm: FC<AuthUser> = ({ authUser }) => {
  const [error, setError] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Post>({
    defaultValues: {
      title: "",
      body: "",
      user_id: authUser?.id,
    }
  });

  const onSubmit: SubmitHandler<Post> = async (data) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/posts`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "",
        },
        body: JSON.stringify({ title: data.title, body: data.body, user_id: data.user_id }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      router.replace("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const markdown = watch("body");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <p className="text-red-500">{error}</p>
      <p className="text-red-500">{errors.title?.message}</p>
      <input type="text" {...register("title", { required: "必須項目です", maxLength: { value: 50, message: "50文字以内で入力してください。" } })} name="title" id="title" placeholder="タイトル" className="block border w-full p-2" />

      <p className="text-red-500">{errors.body?.message}</p>
      <div className="markdown-body flex h-[calc(100%-5.25rem)]">
        <textarea {...register("body", { required: "必須項目です", maxLength: { value: 10000, message: "10000文字以内で入力してください。" } })} name="body" id="body" placeholder="マークダウン記法で記述することができます。" className="flex-1 bg-gray-200"></textarea>

        <div className="flex-1">
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </div>
      </div>
      <input type="hidden" {...register("user_id")} name="user_id" id="user_id" />

      <button disabled={isSubmitting} className="block bg-blue-400 rounded-3xl w-48 mx-auto text-white py-2 hover:bg-blue-300">投稿する</button>
    </form>
  );
};