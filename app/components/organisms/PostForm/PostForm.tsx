'use client';

import type { PostState } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useFormState } from "react-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { createPost } from "@/app/lib/actions";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";


export const PostForm = () => {
  const session = useSession();

  const initialState: PostState = { message: "", errors: {} };
  const [state, formAction] = useFormState(createPost, initialState);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  return (
    <form action={formAction} className="h-full">
      <div className="h-full w-full px-4 py-3">
        <div id="create-error" aria-live="polite" aria-atomic="true">
          {state?.message &&
            <p className="text-red-500">
              {state.message}
            </p>
          }
        </div>

        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <div className="">
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            placeholder="タイトル"
            onChange={handleInputChange(setTitle)}
            className="block w-full border p-2"
          />
        </div>

        <div id="body-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.body &&
            state.errors.body.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <div className="h-[calc(100%-10.625rem)] mt-2">
          <div className="flex h-full">
            <textarea
              name="body"
              id="body"
              placeholder="本文"
              value={body}
              onChange={handleInputChange(setBody)}
              className="flex-1 h-full bg-gray-200 p-2"
            />
            <div className="flex-1 p-2">
              <Markdown remarkPlugins={[remarkGfm]} className="markdown-body">{body}</Markdown>
            </div>
          </div>
        </div>

        <input type="hidden" name="user_id" defaultValue={session.data?.user?.id} />
        <div id="user-id-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.user_id &&
            state.errors.user_id.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <SubmitButton className="w-full p-2 mt-2 bg-black text-white hover:opacity-70">
          投稿する
        </SubmitButton>
      </div>
    </form>
  );
};
