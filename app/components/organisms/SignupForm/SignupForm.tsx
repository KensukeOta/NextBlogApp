"use client";

export const SignupForm = () => {
  return (
    <form method="POST" className="text-center">
      <label htmlFor="name" className="block">
        名前
      </label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="名前"
        required
        className="w-full rounded-lg border px-4 py-3"
      />

      <label htmlFor="email" className="block">
        メールアドレス
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="メールアドレス"
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
        required
        className="w-full rounded-lg border px-4 py-3"
      />

      <label htmlFor="password_confirmation" className="block">
        パスワード確認
      </label>
      <input
        type="password"
        name="password_confirmation"
        id="password_confirmation"
        placeholder="パスワード確認"
        required
        className="w-full rounded-lg border px-4 py-3"
      />

      <button
        type="submit"
        className="mt-2 block w-full rounded-lg border py-3 hover:cursor-pointer hover:bg-slate-200 disabled:cursor-default"
      >
        登録
      </button>
    </form>
  );
};
