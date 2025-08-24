"use client";

import { useActionState } from "react";
import { createUser, SignupState } from "@/app/lib/actions/users";

export const SignupForm = () => {
  const initialState: SignupState = { message: null, errors: {}, values: {} };
  const [state, formAction, isPending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="text-center">
      <div id="create-error" aria-live="polite" aria-atomic="true">
        {state?.message && <p className="text-red-500">{state.message}</p>}
      </div>
      <label htmlFor="name" className="block">
        名前
      </label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="名前"
        aria-describedby="name-error"
        required
        defaultValue={state.values?.name ?? ""}
        className="w-full rounded-lg border px-4 py-3"
      />
      <div id="name-error" aria-live="polite" aria-atomic="true">
        {state.errors?.name &&
          state.errors.name.map((error: string) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <label htmlFor="email" className="block">
        メールアドレス
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="メールアドレス"
        aria-describedby="email-error"
        required
        defaultValue={state.values?.email ?? ""}
        className="w-full rounded-lg border px-4 py-3"
      />
      <div id="email-error" aria-live="polite" aria-atomic="true">
        {state.errors?.email &&
          state.errors.email.map((error: string) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <label htmlFor="password" className="block">
        パスワード
      </label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="パスワード"
        aria-describedby="password-error"
        required
        defaultValue={state.values?.password ?? ""}
        className="w-full rounded-lg border px-4 py-3"
      />
      <div id="password-error" aria-live="polite" aria-atomic="true">
        {state.errors?.password &&
          state.errors.password.map((error: string) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <label htmlFor="password_confirmation" className="block">
        パスワード確認
      </label>
      <input
        type="password"
        name="password_confirmation"
        id="password_confirmation"
        placeholder="パスワード確認"
        aria-describedby="password_confirmation-error"
        required
        defaultValue={state.values?.password_confirmation ?? ""}
        className="w-full rounded-lg border px-4 py-3"
      />
      <div id="password-error" aria-live="polite" aria-atomic="true">
        {state.errors?.password_confirmation &&
          state.errors.password_confirmation.map((error: string) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 block w-full rounded-lg border py-3 hover:cursor-pointer hover:bg-slate-200 disabled:cursor-default dark:hover:bg-slate-800"
      >
        登録
      </button>
    </form>
  );
};
