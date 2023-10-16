"use client";
import type { FC } from "react";

export const LoginForm: FC = () => {
  return (
    <form className="h-full flex items-center justify-center text-center">
      <fieldset className="border rounded-2xl grow">
        <legend className="px-2">ログイン</legend>

        <label>
          メールアドレス
          <input type="email"　name="email" id="email" className="border block mx-auto" />
        </label>

        <label>
          パスワード
          <input type="password" name="password" id="password" className="border block mx-auto" />
        </label>

        <button>ログイン</button>
      </fieldset>
    </form>
  );
};