'use client';

import type { PostState } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { createPost } from "@/app/lib/actions";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";


export const PostForm = () => {
  const session = useSession();

  const initialState: PostState = { message: "", errors: {} };
  const [state, formAction] = useFormState(createPost, initialState);

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
          <input type="text" name="title" id="title" className="block w-full border p-2" />

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
          <textarea name="body" id="body" className="block w-full border p-2" />

          <div id="body-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.body &&
              state.errors.body.map((error: string) => (
                <p className="text-red-500" key={error}>
                  {error}
                </p>
              ))}
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

        <SubmitButton>
          投稿する
        </SubmitButton>
      </div>
    </form>
  );
};
