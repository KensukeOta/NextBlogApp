"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export const LogoutButton = () => {
  const [isLoding, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirectTo: "/login" });
    setIsLoading(false);
  };

  return (
    <button
      type="submit"
      onClick={handleLogout}
      disabled={isLoding}
      className="flex w-full gap-2 rounded-sm px-2 py-1 leading-7 hover:cursor-pointer hover:bg-slate-200 disabled:cursor-default"
    >
      ログアウト
    </button>
  );
};
