"use client";

import type { User } from "@/app/types/User";
import { useActionState } from "react";
import { signOut } from "next-auth/react";
import { deleteUser } from "@/app/lib/actions/users";

export const UserDeleteButton = ({ user }: { user: User }) => {
  const [, formAction, isPending] = useActionState(async () => {
    // confirmのUIはここで
    if (!confirm("ユーザーを削除しますか？")) {
      return;
    }
    const result = await deleteUser(user.id);
    // サインアウトをクライアントで実行（削除成功時のみ）
    if (!result?.message) {
      signOut({ redirectTo: "/login" }); // サインアウト処理
    }
    return result;
  }, undefined);

  return (
    <form action={formAction} className="inline-block">
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-red-500 px-4 py-2 text-white hover:cursor-pointer hover:bg-red-600 disabled:cursor-default"
      >
        ユーザーを削除
      </button>
    </form>
  );
};
