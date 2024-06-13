"use client";

import type { SignupState } from "@/app/lib/actions";
import Link from "next/link"
import { useFormState } from "react-dom";
import { createUser } from "@/app/lib/actions";
import { SubmitButton } from "../../atoms/SubmitButton";

export const SignupForm = () => {
  const initialState: SignupState = { message: "", errors: {} };
  const [state, formAction] = useFormState(createUser, initialState)
  
  return (
    <>
      <form action={formAction}>
        <div id="create-error" aria-live="polite" aria-atomic="true">
          {state?.message &&
            <p className="text-red-500">
              {state.message}
            </p>
          }
        </div>
        <label htmlFor="name" className="block">名前</label>
        <input name="name" id="name" type="text" className="block border" />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <label htmlFor="email" className="block">メールアドレス</label>
        <input name="email" id="email" type="email" className="block border" />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.email &&
            state.errors.email.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <label htmlFor="password" className="block">パスワード</label>
        <input name="password" id="password" type="password" className="block border" />
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.password &&
            state.errors.password.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <label htmlFor="password_confirmation" className="block">パスワード確認</label>
        <input name="password_confirmation" id="password_confirmation" type="password" className="block border" />
        <div id="password_confirmation-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.password_confirmation &&
            state.errors.password_confirmation.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <SubmitButton>登録</SubmitButton>
      </form>

      <div>
        <span className="text-xs mr-2">すでにアカウントをお持ちですか？</span>
        <Link href="/login" className="text-xs text-blue-500 hover:opacity-70">ログイン</Link>
      </div>
    </>
  )
}