"use client";

import { useActionState } from "react";
import { createMessage, MessageState } from "@/app/lib/actions/messages";

export const MessageForm = ({ userId }: { userId: string }) => {
  const initialState: MessageState = { message: null, errors: {}, values: {} };
  const [state, formAction, isPending] = useActionState(
    (prevState: MessageState | undefined, formData: FormData) =>
      createMessage(userId, prevState, formData),
    initialState,
  );

  return (
    <div>
      <form action={formAction} className="flex gap-3">
        <input
          type="text"
          id="content"
          name="content"
          placeholder="メッセージを入力..."
          aria-describedby="content-error"
          required
          defaultValue={state?.values?.content ?? ""}
          className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full flex-1 rounded-md border border-blue-200 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="ring-offset-background focus-visible:ring-ring text-primary-foreground inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:cursor-pointer hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <i className="bi bi-send text-white"></i>
        </button>
      </form>
      <div id="create-error" aria-live="polite" aria-atomic="true">
        {state?.message && <p className="text-red-500">{state.message}</p>}
      </div>

      <div id="content-error" aria-live="polite" aria-atomic="true">
        {state?.errors?.content &&
          state.errors.content.map((error: string) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>
  );
};
