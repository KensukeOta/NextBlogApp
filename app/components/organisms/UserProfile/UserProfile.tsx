"use client";

import type { User } from "@/app/types/User";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Backdrop } from "../../atoms/Backdrop";
import { FollowButton } from "../../atoms/FollowButton";
import { UserProfileEditModal } from "../UserProfileEditModal";

export const UserProfile = ({ user }: { user: User }) => {
  const { data: session } = useSession();

  // 自分がログインしていて、相手のfollowersに自分がいればフォロー中
  const myFollow = user.followers.find((f) => f.id === session?.user.id);
  const isFollowing = !!myFollow;
  const followId = myFollow?.follow_id;

  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleVisibleModal = () => {
    setIsVisible(true);
  };

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // backdrop（背景）をクリックしたときだけ閉じる
    if (event.target instanceof HTMLElement && event.target.classList.contains("backdrop-class")) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <section className="dark:bg-background rounded-lg border border-blue-100 bg-white p-6 dark:border-blue-900">
      <div className="text-center">
        <Image
          src={user.image ?? "/noavatar.png"}
          alt="ユーザー画像"
          width={96}
          height={96}
          className="inline-block rounded-[50%]"
        />
        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
      </div>

      <div className="mt-6 space-y-4">
        <p className="break-words whitespace-pre-line dark:text-slate-400">{user.bio}</p>
        <div className="h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <Link href={`/${encodeURIComponent(user.name)}`} className="hover:underline">
            <div className="text-xl font-bold text-blue-600" aria-label="post-count">
              {user.posts.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">投稿</div>
          </Link>
          <Link href={`/${encodeURIComponent(user.name)}/likes`} className="hover:underline">
            <div className="text-xl font-bold text-blue-600" aria-label="like-count">
              {user.liked_posts.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">いいね</div>
          </Link>
          <Link
            href={`/${encodeURIComponent(user.name)}/following_users`}
            className="hover:underline"
          >
            <div className="text-xl font-bold text-blue-600" aria-label="following-count">
              {user.following.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">フォロー</div>
          </Link>
          <Link href={`/${encodeURIComponent(user.name)}/followers`} className="hover:underline">
            <div className="text-xl font-bold text-blue-600" aria-label="follower-count">
              {user.followers.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">フォロワー</div>
          </Link>
        </div>
        <div className="h-[1px] bg-gray-200"></div>
        <div className="space-y-2">
          {session && (
            <Link
              href={`${session.user.id === user.id ? "/messages" : `/messages/${encodeURIComponent(user.id)}`}`}
              className="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              <i className="bi bi-envelope"></i>
              メッセージを送る
            </Link>
          )}

          {session?.user.id === user.id && (
            <button
              type="button"
              onClick={handleVisibleModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-700 hover:cursor-pointer hover:bg-[#f5f8fa] hover:text-black dark:border-blue-800 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
            >
              <i className="bi bi-pencil-square"></i>
              プロフィールを編集
            </button>
          )}

          {session && session.user.id !== user.id && (
            <FollowButton user={user} isFollowing={isFollowing} followId={followId} />
          )}
        </div>
      </div>
      {isVisible && (
        <>
          <Backdrop />
          <UserProfileEditModal ref={modalRef} user={user} onCloseModal={handleCloseModal} />
        </>
      )}
    </section>
  );
};
