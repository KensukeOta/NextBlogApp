"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <button
      type="submit"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-block w-full hover:bg-slate-200 hover:rounded-lg"
    >
      ログアウト
    </button>
  );
};