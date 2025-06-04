"use client";

import type { Post } from "@/app/types/Post";
import { useActionState, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { PostState, updatePost } from "@/app/lib/actions";

export const PostEditForm = ({ post }: { post: Post }) => {
  const initialState: PostState = { message: null, errors: {}, values: {} };
  const updatePosteWithId = updatePost.bind(null, post.id);
  const [state, formAction, isPending] = useActionState(updatePosteWithId, initialState);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };

  return (
    <form action={formAction} className="h-full">
      <div id="edit-error" aria-live="polite" aria-atomic="true">
        {state?.message && <p className="text-red-500">{state.message}</p>}
      </div>

      <div id="title-error" aria-live="polite" aria-atomic="true">
        {state?.errors?.title &&
          state.errors.title.map((error: string) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="名前"
        aria-describedby="title-error"
        required
        value={title}
        onChange={handleInputChange(setTitle)}
        className="w-full border p-2"
      />

      <div className="mt-2 h-[calc(100%-6.125rem)]">
        <div id="content-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.content &&
            state.errors.content.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <div className="flex h-full">
          <textarea
            name="content"
            id="content"
            placeholder="本文"
            aria-describedby="content-error"
            required
            value={content}
            onChange={handleInputChange(setContent)}
            className="h-full flex-1 bg-gray-200 p-2"
          />

          <div className="markdown-body flex-1 bg-white p-2">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full bg-black p-2 text-white hover:opacity-70"
      >
        更新する
      </button>
    </form>
  );
};
