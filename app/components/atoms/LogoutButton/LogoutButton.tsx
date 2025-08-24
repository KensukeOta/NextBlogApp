"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export const LogoutButton = () => {
  const [isLoding, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const flash = {
      type: "success",
      message: "ログアウトしました",
    };
    document.cookie = `flash=${encodeURIComponent(JSON.stringify(flash))}; path=/`;

    await signOut({ redirectTo: "/login" });

    setIsLoading(false);
  };

  return (
    <button
      type="submit"
      onClick={handleLogout}
      disabled={isLoding}
      className="flex w-full gap-2 rounded-sm px-2 py-1 leading-7 hover:cursor-pointer hover:bg-slate-200 disabled:cursor-default dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
    >
      ログアウト
    </button>
  );
};
