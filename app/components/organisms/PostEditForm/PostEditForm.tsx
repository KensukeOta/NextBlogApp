"use client";

import type { Post } from "@/app/types/Post";
import type { PostState } from "@/app/lib/actions";
import { updatePost } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";

export const PostEditForm = ({ post }: { post: Post }) => {
  const initialState: PostState = { message: "", errors: {} };
  const updatePostWithId = updatePost.bind(null, post.id);
  const [state, formAction] = useFormState(updatePostWithId, initialState);

  return (
    <form action={formAction} className="h-full flex items-center justify-center text-center p-4">
      <div className="w-full max-w-md">
        <div id="create-error" aria-live="polite" aria-atomic="true">
          {state?.message &&
            <p className="text-red-500">
              {state.message}
            </p>
          }
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">タイトル</label>
          <input type="text" name="title" id="title" defaultValue={post.title} className="block w-full border p-2" />

          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block mb-2">本文</label>
          <textarea name="body" id="body" defaultValue={post.body} className="block w-full border p-2" />

          <div id="body-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.body &&
              state.errors.body.map((error: string) => (
                <p className="text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <input type="hidden" name="user_id" defaultValue={post.user_id} />
        <div id="user-id-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.user_id &&
            state.errors.user_id.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <SubmitButton>
          更新する
        </SubmitButton>
      </div>
    </form>
  );
};