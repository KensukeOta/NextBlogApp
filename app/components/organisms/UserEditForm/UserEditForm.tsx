"use client";

import type { User } from "@/app/types/User";
import { useActionState } from "react";
import { updateUser, UserState } from "@/app/lib/actions";

export const UserEditForm = ({ user, onCloseModal }: { user: User; onCloseModal: () => void }) => {
  const initialState: UserState = { message: null, errors: {}, values: {} };
  const updatePosteWithId = updateUser.bind(null, user.id);
  const [state, formAction, isPending] = useActionState(updatePosteWithId, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="w-full">
        <div
          role="tablist"
          className="text-muted-foreground grid h-10 w-full grid-cols-2 items-center justify-center rounded-md bg-blue-50 p-1"
        >
          <button
            type="button"
            className="ring-offset-background focus-visible:ring-ring bg-background inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            基本情報
          </button>
        </div>
        <div className="mt-6 space-y-6">
          <div id="edit-error" aria-live="polite" aria-atomic="true">
            {state?.message && <p className="text-red-500">{state.message}</p>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="inline-block text-sm leading-none font-medium text-blue-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              表示名
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="表示名を入力"
              aria-describedby="name-error"
              required
              defaultValue={state?.values?.name ?? user.name}
              className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-blue-200 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.name &&
                state?.errors.name.map((error: string) => (
                  <p className="text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <p className="text-sm text-slate-500">他のユーザーに表示される名前です。</p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="inline-block text-sm leading-none font-medium text-blue-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              自己紹介
            </label>
            <textarea
              name="bio"
              id="bio"
              placeholder="あなたのスキルや目標、好きな言語などを書いてみましょう。"
              aria-describedby="bio-error"
              defaultValue={state?.values?.bio ?? user.bio}
              className="bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-32 w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
            <div id="bio-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.bio &&
                state?.errors?.bio.map((error: string) => (
                  <p className="text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <p className="text-sm text-slate-500">200文字以内で入力してください。</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCloseModal}
          className="ring-offset-background focus-visible:ring-ring bg-background inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-200 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-700 transition-colors hover:cursor-pointer hover:bg-blue-50 hover:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:cursor-pointer hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          変更を保存
        </button>
      </div>
    </form>
  );
};
