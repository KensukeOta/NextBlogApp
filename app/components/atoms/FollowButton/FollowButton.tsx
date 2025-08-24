"use client";

import type { User } from "@/app/types/User";
import type { FollowUser } from "@/app/types/FollowUser";
import { useActionState } from "react";
import { createFollow, deleteFollow, FollowState } from "@/app/lib/actions/follows";

type FollowButtonProps = {
  isFollowing: boolean;
  followId?: string;
  user: User | FollowUser;
};

export const FollowButton = ({ user, isFollowing, followId }: FollowButtonProps) => {
  const initialState: FollowState = { message: null };
  const [state, formAction, isPending] = useActionState(
    async (prevState: FollowState | undefined, formData: FormData) => {
      if (isFollowing && followId) {
        // アンフォロー処理
        return await deleteFollow(followId, prevState, formData);
      } else {
        // フォロー処理
        return await createFollow(user.id, prevState, formData);
      }
    },
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="name" id="name" value={user.name} />

      <button
        type="submit"
        disabled={isPending}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm whitespace-nowrap text-blue-700 ${isFollowing ? "border-gray-300 bg-gray-300 font-bold text-white hover:bg-gray-300/80 dark:bg-slate-800 dark:hover:bg-slate-700" : "border-blue-200 font-medium hover:bg-[#f5f8fa] hover:text-black dark:text-blue-400 dark:hover:bg-slate-800"} disabled:cursor-defaultdark:text-blue-400 hover:cursor-pointer dark:hover:text-blue-400`}
      >
        {isFollowing ? "フォロー中" : "フォロー"}
      </button>
      {state?.message && <div className="mt-2 text-xs text-red-500">{state.message}</div>}
    </form>
  );
};
