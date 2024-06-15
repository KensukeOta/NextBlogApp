"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { SubmitButton } from "../../atoms/SubmitButton";
import { LoginState, authenticate } from "@/app/lib/actions";

export const LoginForm = () => {
  const initialState: LoginState = { message: "", errors: {} };
  const [state, formAction] = useFormState(authenticate, initialState)
  
  return (
    <>
      <form action={formAction}>
        <div id="auth-error" aria-live="polite" aria-atomic="true">
          {state?.message &&
            <p className="text-red-500">
              {state.message}
            </p>
          }
        </div>
        <label htmlFor="email" className="block">メールアドレス</label>
        <input name="email" id="email" type="email" className="border" />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.email &&
            state.errors.email.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <label htmlFor="password" className="block">パスワード</label>
        <input name="password" id="password" type="password" className="border" />
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.password &&
            state.errors.password.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <SubmitButton>ログイン</SubmitButton>
      </form>
      
      <div>
        <span className="text-xs mr-2">アカウントをお持ちではないですか？</span>
        <Link href="/signup" className="text-xs text-blue-500 hover:opacity-70">新規登録</Link>
      </div>
    </>
  );
}