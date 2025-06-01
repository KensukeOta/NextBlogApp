"use client";

export const LoginForm = () => {
  return (
    <form className="text-center">
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
        className="w-full rounded-lg border px-4 py-3"
      />

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
        className="w-full rounded-lg border px-4 py-3"
      />


      <button
        type="submit"
        className="mt-2 block w-full rounded-lg border py-3 hover:cursor-pointer hover:bg-slate-200 disabled:cursor-default"
      >
        ログイン
      </button>
    </form>
  );
};
