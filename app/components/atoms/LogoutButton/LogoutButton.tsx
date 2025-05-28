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
    <button type="submit" onClick={handleLogout} disabled={isLoding}>
      ログアウト
    </button>
  );
};
