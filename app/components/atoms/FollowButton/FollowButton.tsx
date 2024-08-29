"use client";

import type { User } from "@/app/types/User";
import { useSession } from "next-auth/react";
import { createFollow, deleteFollow } from "@/app/lib/actions";
import { SubmitButton } from "@/app/components/atoms/SubmitButton";

export const FollowButton = ({ user }: { user: User }) => {
  const session = useSession();

  const Following = user.followers.find((follower) => follower.id === session.data?.user?.id);
  
  const handleSubmit = () => {
    if (!session.data?.user) {
      alert("ログインすると「フォロー」をすることができます！");
      return;
    }

    if (Following) {
      deleteFollow(session?.data?.user?.id as string, user.id);
    } else {
      createFollow(session?.data?.user?.id as string, user.id)
    }
  };
  
  return (
    <form action={handleSubmit}>
      <SubmitButton
        className={`${Following ? "bg-gray-100 text-black hover:bg-gray-200" : "bg-black text-white hover:opacity-70"} border font-bold mt-6 px-4 py-1 rounded-lg w-full`}
      >
        {Following ? "フォロー中" : "フォロー"}
      </SubmitButton>
    </form>
  );
};