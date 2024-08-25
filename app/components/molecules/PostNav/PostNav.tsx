"use client";

import type { User } from "@/app/types/User";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const PostNav = ({ user }: { user: User }) => {
  const pathname = usePathname();
  
  return (
    <nav className="mt-4">
      <Link
        href={`/${user.name}`}
        className={`${pathname === `/${encodeURIComponent(user.name)}` && "bg-black text-white"} px-4 py-1 rounded-3xl`}
      >
        記事
      </Link>
      <Link
        href={`/${user.name}/likes`}
        className={`${pathname === `/${encodeURIComponent(user.name)}/likes` && "bg-black text-white"} px-4 py-1 rounded-3xl`}
      >
        いいね
      </Link>
    </nav>
  );
};