"use client";

import type { User } from "@/app/types/User";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Backdrop } from "../../atoms/Backdrop";
import { UserProfileEditModal } from "../UserProfileEditModal";

export const UserProfile = ({ user }: { user: User }) => {
  const { data: session } = useSession();

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
    <section className="rounded-lg border border-blue-100 bg-white p-6">
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
        <p className="break-words whitespace-pre-line">{user.bio}</p>
        <div className="h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-blue-600" aria-label="post-count">
              {user.posts.length}
            </div>
            <div className="text-xs text-gray-500">投稿</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600" aria-label="like-count">
              {user.liked_posts.length}
            </div>
            <div className="text-xs text-gray-500">いいね</div>
          </div>
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-700 hover:cursor-pointer hover:bg-[#f5f8fa] hover:text-black"
            >
              <i className="bi bi-pencil-square"></i>
              プロフィールを編集
            </button>
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
