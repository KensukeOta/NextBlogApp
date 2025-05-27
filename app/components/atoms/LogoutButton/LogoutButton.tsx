"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <button type="submit" onClick={() => signOut({ redirectTo: "/login" })}>
      ログアウト
    </button>
  );
};
