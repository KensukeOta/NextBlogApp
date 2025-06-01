"use client";

import { useActionState } from "react";
import { authenticate, LoginState } from "@/app/lib/actions";

export const LoginForm = () => {
  const initialState: LoginState = { message: null, errors: {}, values: {} };
  const [state, formAction, isPending] = useActionState(authenticate, initialState);

  return (
    <form action={formAction} className="text-center">
      <div id="auth-error" aria-live="polite" aria-atomic="true">
        {state?.message && <p className="text-red-500">{state.message}</p>}
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

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 block w-full rounded-lg border py-3 hover:cursor-pointer hover:bg-slate-200 disabled:cursor-default"
      >
        ログイン
      </button>
    </form>
  );
};
