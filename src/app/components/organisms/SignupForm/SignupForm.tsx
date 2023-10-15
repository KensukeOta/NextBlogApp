"use client";
import type { FC } from "react";

export const SignupForm: FC = () => {
  return (
    <form className="h-full flex items-center justify-center text-center">
      <fieldset className="border rounded-2xl grow">
        <legend className="px-2">登録</legend>
        <label>
          名前
          <input type="text" name="name" id="name" className="border block mx-auto" />
        </label>

        <label>
          メールアドレス
          <input type="email" name="email" id="email" className="border block mx-auto" />
        </label>

        <label>
          パスワード
          <input type="password" name="password" id="password" className="border block mx-auto" />
        </label>

        <label>
          パスワード確認
          <input type="password" name="password_confirmation" id="password_confirmation" className="border block mx-auto" />
        </label>

        <button>登録</button>
      </fieldset>
    </form>
  );
};